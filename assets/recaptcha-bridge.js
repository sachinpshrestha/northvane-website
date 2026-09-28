/*
 * reCAPTCHA v3 bridge for the CCP Recruit job board.
 *
 * The job board component can't see this page's grecaptcha global, so it asks
 * for a token with a `ccp-recaptcha-request` DOM event; this script runs
 * grecaptcha.execute() and answers with `ccp-recaptcha-response`.
 * Same protocol as the RecaptchaBridge static resource on the Experience site.
 */
(function () {
  var KEY = '6LcKWQMtAAAAAKmCaWG7DLV4EKO5FR60xcyX3JgF';
  document.addEventListener('ccp-recaptcha-request', function (e) {
    var d = (e && e.detail) || {};
    var id = d.requestId;
    var action = d.action || 'apply';
    function respond(payload) {
      document.dispatchEvent(new CustomEvent('ccp-recaptcha-response', { detail: payload }));
    }
    try {
      if (!window.grecaptcha || !window.grecaptcha.execute) {
        respond({ requestId: id, error: 'grecaptcha not loaded' });
        return;
      }
      window.grecaptcha.ready(function () {
        window.grecaptcha.execute(KEY, { action: action })
          .then(function (token) { respond({ requestId: id, token: token }); })
          .catch(function (err) { respond({ requestId: id, error: (err && err.message) || String(err) }); });
      });
    } catch (err) {
      respond({ requestId: id, error: (err && err.message) || String(err) });
    }
  });
})();
