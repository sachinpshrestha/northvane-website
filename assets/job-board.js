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

  var container = document.getElementById('job-board');
  var status = document.getElementById('job-board-status');
  var fallback = document.getElementById('job-board-fallback');
  var done = false;

  function fail(reason) {
    if (done) return;
    done = true;
    if (window.console) console.warn('Job board did not load:', reason);
    status.textContent = 'Open roles are unavailable right now.';
    fallback.hidden = false;
  }

  // Give up after 20 seconds so visitors always get a way forward.
  var timer = window.setTimeout(function () { fail('timed out'); }, 20000);

  if (!window.$Lightning) {
    fail('lightning.out.js did not load');
    return;
  }

  try {
    window.$Lightning.use(APP, function () {
      window.$Lightning.createComponent(COMPONENT, PROPS, 'job-board', function (cmp, createStatus, error) {
        window.clearTimeout(timer);
        if (createStatus && createStatus !== 'SUCCESS') {
          fail(error || createStatus);
          return;
        }
        done = true;
        if (status && status.parentNode === container) container.removeChild(status);
      });
    }, SITE_URL);
  } catch (e) {
    window.clearTimeout(timer);
    fail(e && e.message ? e.message : e);
  }
})();
