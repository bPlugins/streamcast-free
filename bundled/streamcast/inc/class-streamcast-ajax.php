<?php
namespace StreamCast;

if ( ! defined( 'ABSPATH' ) ) exit;

/**
 * Handle AJAX requests for StreamCast
 */
class AJAX {
	public function __construct() {
		add_action( 'wp_ajax_streamcast_fetch_stream', array( $this, 'fetch_stream_data' ) );
		add_action( 'wp_ajax_nopriv_streamcast_fetch_stream', array( $this, 'fetch_stream_data' ) );
	}

	/**
	 * Fetch stream data (proxy request to avoid CORS issues)
	 */
	public function fetch_stream_data() {
		// Verify nonce
		$nonce = isset( $_POST['nonce'] ) ? sanitize_text_field( wp_unslash( $_POST['nonce'] ) ) : '';
		if ( empty( $nonce ) || ! wp_verify_nonce( $nonce, 'streamcast_fetch_nonce' ) ) {
			wp_send_json_error( 'Invalid nonce', 403 );
		}

		// Get and validate URL
		$url = isset( $_POST['url'] ) ? esc_url_raw( wp_unslash( $_POST['url'] ) ) : '';
		if ( empty( $url ) ) {
			wp_send_json_error( 'Invalid URL', 400 );
		}

		// SSRF Protection: only Shoutcast/Icecast metadata endpoints are proxied
		if ( ! $this->is_stream_metadata_url( $url ) ) {
			wp_send_json_error( 'Invalid URL', 400 );
		}

		// Fetch the data (every redirect target is validated again before it is followed)
		$response = self::remote_get_public( $url, array(
			'timeout'             => 5,
			'limit_response_size' => 512 * KB_IN_BYTES,
		) );

		if ( is_wp_error( $response ) ) {
			wp_send_json_error( 'Unable to fetch stream data', 500 );
		}

		$body = wp_remote_retrieve_body( $response );

		// Return only the title fields the player shows, without markup (stored XSS)
		wp_send_json_success( $this->sanitize_stream_metadata( $url, $body ) );
	}

	/**
	 * Strip the remote response down to plain-text title data, in the same shape the player expects
	 *
	 * Shoutcast /currentsong is returned as plain text. Icecast /status-json.xsl is returned as a JSON
	 * string holding only icestats.source title / song / server_name.
	 */
	private function sanitize_stream_metadata( $url, $body ) {
		$path = (string) wp_parse_url( $url, PHP_URL_PATH );

		if ( ! preg_match( '#/status-json\.xsl$#i', $path ) ) {
			return wp_strip_all_tags( (string) $body );
		}

		$data = json_decode( (string) $body, true );
		if ( ! is_array( $data ) || ! isset( $data['icestats'] ) || ! is_array( $data['icestats'] ) ) {
			return '';
		}

		$icestats = array();
		$source   = isset( $data['icestats']['source'] ) ? $data['icestats']['source'] : null;

		if ( is_array( $source ) ) {
			// Multi-mount servers send a list of sources, single-mount servers one object
			$icestats['source'] = wp_is_numeric_array( $source )
				? array_values( array_map( array( $this, 'sanitize_icecast_source' ), array_filter( $source, 'is_array' ) ) )
				: $this->sanitize_icecast_source( $source );
		}

		return wp_json_encode( array( 'icestats' => (object) $icestats ) );
	}

	/**
	 * Keep only the Icecast source fields the player reads, as plain text
	 */
	private function sanitize_icecast_source( $source ) {
		$clean = array();
		foreach ( array( 'title', 'song', 'server_name' ) as $key ) {
			if ( isset( $source[ $key ] ) && is_scalar( $source[ $key ] ) ) {
				$clean[ $key ] = wp_strip_all_tags( (string) $source[ $key ] );
			}
		}

		return (object) $clean;
	}

	/**
	 * Check that the URL points to a Shoutcast (/currentsong) or Icecast (/status-json.xsl) metadata endpoint
	 */
	private function is_stream_metadata_url( $url ) {
		$parts = wp_parse_url( $url );
		if ( empty( $parts['scheme'] ) || empty( $parts['host'] ) || empty( $parts['path'] ) ) {
			return false;
		}

		if ( ! in_array( strtolower( $parts['scheme'] ), array( 'http', 'https' ), true ) ) {
			return false;
		}

		$path  = $parts['path'];
		$query = isset( $parts['query'] ) ? $parts['query'] : '';

		// Shoutcast: <stream>/currentsong?sid=1
		if ( preg_match( '#/currentsong$#i', $path ) ) {
			return '' === $query || (bool) preg_match( '/^sid=\d+$/', $query );
		}

		// Icecast: <stream>/status-json.xsl
		if ( preg_match( '#/status-json\.xsl$#i', $path ) ) {
			return '' === $query;
		}

		return false;
	}

	/**
	 * GET a URL that must be public, validating every redirect hop
	 *
	 * @param string        $url       URL to fetch.
	 * @param array         $args      Extra wp_remote_get() arguments.
	 * @param callable|null $validator Extra check for each hop, validate_url() by default.
	 * @return array|\WP_Error
	 */
	public static function remote_get_public( $url, $args = array(), $validator = null ) {
		$validator = $validator ? $validator : array( __CLASS__, 'validate_url' );

		// Redirects are followed here instead of by WordPress, so each target is checked first
		$args['redirection'] = 0;

		for ( $hops = 0; $hops <= 3; $hops++ ) {
			$scheme = strtolower( (string) wp_parse_url( $url, PHP_URL_SCHEME ) );
			if ( ! in_array( $scheme, array( 'http', 'https' ), true ) || ! call_user_func( $validator, $url ) || ! self::is_public_host( $url ) ) {
				return new \WP_Error( 'streamcast_unsafe_url', 'Insecure or invalid URL detected' );
			}

			$response = wp_remote_get( $url, $args );
			if ( is_wp_error( $response ) ) {
				return $response;
			}

			$code     = (int) wp_remote_retrieve_response_code( $response );
			$location = wp_remote_retrieve_header( $response, 'location' );
			if ( $code < 300 || $code >= 400 || empty( $location ) ) {
				return $response;
			}

			$url = \WP_Http::make_absolute_url( is_array( $location ) ? end( $location ) : $location, $url );
		}

		return new \WP_Error( 'streamcast_too_many_redirects', 'Too many redirects' );
	}

	/**
	 * wp_http_validate_url(), but with the URL's own port allowed
	 *
	 * Shoutcast / Icecast servers usually run on ports like 8000, which are not on
	 * WordPress' safe port list (80, 443, 8080). The host is still checked.
	 */
	public static function validate_url( $url ) {
		$allow_stream_port = static function ( $ports, $host, $checked ) {
			$port = wp_parse_url( $checked, PHP_URL_PORT );

			return $port ? array_merge( (array) $ports, array( (int) $port ) ) : $ports;
		};

		add_filter( 'http_allowed_safe_ports', $allow_stream_port, 10, 3 );
		$valid = wp_http_validate_url( $url );
		remove_filter( 'http_allowed_safe_ports', $allow_stream_port, 10 );

		return (bool) $valid;
	}

	/**
	 * Check that the host only resolves to public addresses
	 *
	 * wp_http_validate_url() does not block link-local / cloud metadata (169.254.0.0/16)
	 * or IPv6 on older WordPress versions, so the addresses are checked here as well.
	 */
	public static function is_public_host( $url ) {
		$host = wp_parse_url( $url, PHP_URL_HOST );
		if ( empty( $host ) ) {
			return false;
		}
		$host = trim( $host, '[]' );

		if ( filter_var( $host, FILTER_VALIDATE_IP ) ) {
			$ips = array( $host );
		} else {
			$ips = gethostbynamel( $host );
			if ( empty( $ips ) ) {
				return false;
			}

			$records = function_exists( 'dns_get_record' ) ? @dns_get_record( $host, DNS_AAAA ) : array();
			foreach ( (array) $records as $record ) {
				if ( ! empty( $record['ipv6'] ) ) {
					$ips[] = $record['ipv6'];
				}
			}
		}

		foreach ( $ips as $ip ) {
			if ( ! filter_var( $ip, FILTER_VALIDATE_IP, FILTER_FLAG_NO_PRIV_RANGE | FILTER_FLAG_NO_RES_RANGE ) ) {
				return false;
			}

			// IPv4-mapped IPv6 (::ffff:127.0.0.1) and 100.64.0.0/10 (CGNAT) are not covered by the flags above
			if ( preg_match( '/^::ffff:/i', $ip ) || preg_match( '/^100\.(6[4-9]|[7-9]\d|1[01]\d|12[0-7])\./', $ip ) ) {
				return false;
			}
		}

		return true;
	}
}
