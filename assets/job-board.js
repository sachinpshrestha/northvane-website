/*
 * Places the CCP Recruit job board on this page with Salesforce Lightning Out.
 *
 * SITE_URL is the Experience Cloud site that serves the component to anonymous
 * visitors (as its guest user). APP is the Lightning Out app deployed in the org.
 * PROPS configure the board the same way Experience Builder properties do.
 */
(function () {
  var SITE_URL = 'https://yachting-dev-ed.develop.my.site.com';
  var APP = 'c:ccpRecruitOut';
  var COMPONENT = 'c:atsJobBoard';
  var PROPS = {
    title: 'Open roles at Northvane',
    subtitle: 'Engineering, operations and analytics roles across our four offices',
    applicationSource: 'Company Website',
    successTitle: 'Thanks, your application is in',
    successMessage: 'A Northvane recruiter will review it and reply within five working days.'
  };
  var TIMEOUT_MS = 45000;

  var container = document.getElementById('job-board');
  var status = document.getElementById('job-board-status');
  var fallback = document.getElementById('job-board-fallback');
  var loaded = false;

  function describe(reason) {
    if (!reason) return 'unknown error';
    if (typeof reason === 'string') return reason;
    if (reason.message) return reason.message;
    try { return JSON.stringify(reason); } catch (e) { return String(reason); }
  }

  // Shows the fallback link plus the technical reason, so a failure can be diagnosed.
  function fail(reason) {
    if (loaded) return;
    var text = describe(reason);
    if (window.console) console.error('[Northvane job board] did not load:', reason);
    status.textContent = 'Open roles are unavailable right now.';
    var detail = document.getElementById('job-board-error');
    if (!detail) {
      detail = document.createElement('p');
      detail.id = 'job-board-error';
      detail.className = 'job-board-error';
      container.appendChild(detail);
    }
    detail.textContent = 'Details: ' + text;
    fallback.hidden = false;
  }

  function succeed() {
    loaded = true;
    window.clearTimeout(timer);
    fallback.hidden = true;
    var detail = document.getElementById('job-board-error');
    if (detail) detail.parentNode.removeChild(detail);
    if (status && status.parentNode === container) container.removeChild(status);
  }

  window.addEventListener('error', function (e) {
    // Script errors from Salesforce files usually explain a failed load.
    if (!loaded && e && e.filename && e.filename.indexOf('force.com') + e.filename.indexOf('site.com') > -2) {
      fail(e.message + ' (' + e.filename.split('/').pop() + ')');
    }
  });

  var timer = window.setTimeout(function () {
    fail('Timed out after ' + TIMEOUT_MS / 1000 + ' seconds waiting for Salesforce.');
  }, TIMEOUT_MS);

  if (!window.$Lightning) {
    fail('The Salesforce Lightning Out script did not load (' + SITE_URL + '/lightning/lightning.out.js). '
      + 'A browser extension or privacy setting may be blocking it.');
    return;
  }

  try {
    window.$Lightning.use(APP, function () {
      window.$Lightning.createComponent(COMPONENT, PROPS, 'job-board', function (cmp, createStatus, error) {
        if (createStatus && createStatus !== 'SUCCESS') {
          fail('Component ' + createStatus + ': ' + describe(error));
          return;
        }
        succeed();
      });
    }, SITE_URL);
  } catch (e) {
    fail(e);
  }
})();
