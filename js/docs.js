angular.module('docsApp', [
  'ngRoute',
  'ngCookies',
  'ngSanitize',
  'ngAnimate',
  'DocsController',
  'versionsData',
  'pagesData',
  'directives',
  'errors',
  'examples',
  'search',
  'tutorials',
  'versions',
  'bootstrap',
  'bootstrapPrettify',
  'ui.bootstrap.dropdown'
])


.config(function($locationProvider) {
  //$locationProvider.html5Mode(false).hashPrefix('!');
});
angular.module('directives', [])

.directive('code', function() {
  return { restrict:'E', terminal: true };
})

/**
 * backToTop Directive
 * @param  {Function} $anchorScroll
 *
 * @description Ensure that the browser scrolls when the anchor is clicked
 */
.directive('backToTop', ['$anchorScroll', function($anchorScroll) {
  return function link(scope, element) {
    element.on('click', function(event) {
      scope.$apply($anchorScroll);
    });
  };
}])


.directive('code', function() {
  return {
    restrict: 'E',
    terminal: true,
    compile: function(element) {
      var linenums = element.hasClass('linenum') || element.parent()[0].nodeName === 'PRE';
      var match = /lang-(\S)+/.exec(element.className);
      var lang = match && match[1];
      var html = element.html();
      element.html(window.prettyPrintOne(html, lang, linenums));
    }
  };
});


angular.module('DocsController', [])

.controller('DocsController', function($scope, $rootScope, $location, $window, $cookies, NG_PAGES, NG_NAVIGATION, NG_VERSION) {

  $scope.fold = function(url) {
    if(url) {
      $scope.docs_fold = '/notes/' + url;
      if(/\/build/.test($window.location.href)) {
        $scope.docs_fold = '/build/docs' + $scope.docs_fold;
      }
      window.scrollTo(0,0);
    }
    else {
      $scope.docs_fold = null;
    }
  };
  var OFFLINE_COOKIE_NAME = 'ng-offline',
      INDEX_PATH = /^(\/|\/index[^\.]*.html)$/;


  /**********************************
   Publish methods
   ***********************************/

  $scope.navClass = function(navItem) {
    return {
      active: navItem.href && this.currentPage.path,
      'nav-index-section': navItem.type === 'section'
    };
  };

  $scope.afterPartialLoaded = function() {
    var pagePath = $scope.currentPage ? $scope.currentPage.path : $location.path();
    $window._gaq.push(['_trackPageview', pagePath]);
  };

  /** stores a cookie that is used by apache to decide which manifest ot send */
  $scope.enableOffline = function() {
    //The cookie will be good for one year!
    var date = new Date();
    date.setTime(date.getTime()+(365*24*60*60*1000));
    var expires = "; expires="+date.toGMTString();
    var value = angular.version.full;
    document.cookie = OFFLINE_COOKIE_NAME + "="+value+expires+"; path=" + $location.path;

    //force the page to reload so server can serve new manifest file
    window.location.reload(true);
  };



  /**********************************
   Watches
   ***********************************/


  $scope.$watch(function docsPathWatch() {return $location.path(); }, function docsPathWatchAction(path) {

    var currentPage = $scope.currentPage = NG_PAGES[path];
    if ( !currentPage && path.charAt(0)==='/' ) {
      // Strip off leading slash
      path = path.substr(1);
    }

    currentPage = $scope.currentPage = NG_PAGES[path];
    if ( !currentPage && path.charAt(path.length-1) === '/' && path.length > 1 ) {
      // Strip off trailing slash
      path = path.substr(0, path.length-1);
    }

    currentPage = $scope.currentPage = NG_PAGES[path];
    if ( !currentPage && /\/index$/.test(path) ) {
      // Strip off index from the end
      path = path.substr(0, path.length - 6);
    }

    currentPage = $scope.currentPage = NG_PAGES[path];

    if ( currentPage ) {
      $scope.currentArea = currentPage && NG_NAVIGATION[currentPage.area];
      var pathParts = currentPage.path.split('/');
      var breadcrumb = $scope.breadcrumb = [];
      var breadcrumbPath = '';
      angular.forEach(pathParts, function(part) {
        breadcrumbPath += part;
        breadcrumb.push({ name: (NG_PAGES[breadcrumbPath]&&NG_PAGES[breadcrumbPath].name) || part, url: breadcrumbPath });
        breadcrumbPath += '/';
      });
    } else {
      $scope.currentArea = null;
      $scope.breadcrumb = [];
    }
  });

  /**********************************
   Initialize
   ***********************************/

  $scope.versionNumber = angular.version.full;
  $scope.version = angular.version.full + "  " + angular.version.codeName;
  $scope.subpage = false;
  $scope.offlineEnabled = ($cookies[OFFLINE_COOKIE_NAME] == angular.version.full);
  $scope.futurePartialTitle = null;
  $scope.loading = 0;
  $scope.$cookies = $cookies;

  $cookies.platformPreference = $cookies.platformPreference || 'gitUnix';

  if (!$location.path() || INDEX_PATH.test($location.path())) {
    $location.path('/api').replace();
  }

  // bind escape to hash reset callback
  angular.element(window).on('keydown', function(e) {
    if (e.keyCode === 27) {
      $scope.$apply(function() {
        $scope.subpage = false;
      });
    }
  });
});

angular.module('errors', ['ngSanitize'])

.filter('errorLink', ['$sanitize', function ($sanitize) {
  var LINKY_URL_REGEXP = /((ftp|https?):\/\/|(mailto:)?[A-Za-z0-9._%+-]+@)\S*[^\s\.\;\,\(\)\{\}<>]/g,
      MAILTO_REGEXP = /^mailto:/,
      STACK_TRACE_REGEXP = /:\d+:\d+$/;

  var truncate = function (text, nchars) {
    if (text.length > nchars) {
      return text.substr(0, nchars - 3) + '...';
    }
    return text;
  };

  return function (text, target) {
    var targetHtml = target ? ' target="' + target + '"' : '';

    if (!text) return text;

    return $sanitize(text.replace(LINKY_URL_REGEXP, function (url) {
      if (STACK_TRACE_REGEXP.test(url)) {
        return url;
      }

      // if we did not match ftp/http/mailto then assume mailto
      if (!/^((ftp|https?):\/\/|mailto:)/.test(url)) url = 'mailto:' + url;

      return '<a' + targetHtml + ' href="' + url +'">' +
                truncate(url.replace(MAILTO_REGEXP, ''), 60) +
              '</a>';
    }));
  };
}])


.directive('errorDisplay', ['$location', 'errorLinkFilter', function ($location, errorLinkFilter) {
  var interpolate = function (formatString) {
    var formatArgs = arguments;
    return formatString.replace(/\{\d+\}/g, function (match) {
      // Drop the braces and use the unary plus to convert to an integer.
      // The index will be off by one because of the formatString.
      var index = +match.slice(1, -1);
      if (index + 1 >= formatArgs.length) {
        return match;
      }
      return formatArgs[index+1];
    });
  };

  return {
    link: function (scope, element, attrs) {
      var search = $location.search(),
        formatArgs = [attrs.errorDisplay],
        i;

      for (i = 0; angular.isDefined(search['p'+i]); i++) {
        formatArgs.push(search['p'+i]);
      }
      element.html(errorLinkFilter(interpolate.apply(null, formatArgs), '_blank'));
    }
  };
}]);
angular.module('examples', [])

.directive('sourceEdit', function(getEmbeddedTemplate) {
  return {
    template: '<div class="btn-group pull-right">' +
        '<a class="btn dropdown-toggle btn-primary" data-toggle="dropdown" href>' +
        '  <i class="icon-pencil icon-white"></i> Edit<span class="caret"></span>' +
        '</a>' +
        '<ul class="dropdown-menu">' +
        '  <li><a ng-click="plunkr($event)" href="">In Plunkr</a></li>' +
        '  <li><a ng-click="fiddle($event)" href="">In JsFiddle</a></li>' +
        '</ul>' +
        '</div>',
    scope: true,
    controller: function($scope, $attrs, openJsFiddle, openPlunkr) {
      var sources = {
        module: $attrs.sourceEdit,
        deps: read($attrs.sourceEditDeps),
        html: read($attrs.sourceEditHtml),
        css: read($attrs.sourceEditCss),
        js: read($attrs.sourceEditJs),
        json: read($attrs.sourceEditJson),
        unit: read($attrs.sourceEditUnit),
        scenario: read($attrs.sourceEditScenario)
      };
      $scope.fiddle = function(e) {
        e.stopPropagation();
        openJsFiddle(sources);
      };
      $scope.plunkr = function(e) {
        e.stopPropagation();
        openPlunkr(sources);
      };
    }
  };

  function read(text) {
    var files = [];
    angular.forEach(text ? text.split(' ') : [], function(refId) {
      // refId is index.html-343, so we need to strip the unique ID when exporting the name
      files.push({name: refId.replace(/-\d+$/, ''), content: getEmbeddedTemplate(refId)});
    });
    return files;
  }
})


.factory('angularUrls', function($document) {
  var urls = {};

  angular.forEach($document.find('script'), function(script) {
    var match = script.src.match(/^.*\/(angular[^\/]*\.js)$/);
    if (match) {
      urls[match[1].replace(/(\-\d.*)?(\.min)?\.js$/, '.js')] = match[0];
    }
  });

  return urls;
})


.factory('formPostData', function($document) {
  return function(url, fields) {
    var form = angular.element('<form style="display: none;" method="post" action="' + url + '" target="_blank"></form>');
    angular.forEach(fields, function(value, name) {
      var input = angular.element('<input type="hidden" name="' +  name + '">');
      input.attr('value', value);
      form.append(input);
    });
    $document.find('body').append(form);
    form[0].submit();
    form.remove();
  };
})


.factory('prepareDefaultAppModule', function() {
  return function(content) {
    var deps = [];
    angular.forEach(content.deps, function(file) {
      if(file.name == 'angular-animate.js') {
        deps.push('ngAnimate');
      }
    });

    var moduleName = 'App';
    return {
      module : moduleName,
      script : "angular.module('" + moduleName + "', [" +
          (deps.length ? "'" + deps.join("','") + "'" : "") + "]);\n\n"
    };
  };
})

.factory('prepareEditorAssetTags', function(angularUrls) {
  return function(content, options) {
    options = options || {};
    var includeLocalFiles = options.includeLocalFiles;
    var html = makeScriptTag(angularUrls['angular.js']);

    var allFiles = [].concat(content.js, content.css, content.html, content.json);
    angular.forEach(content.deps, function(file) {
      if (file.name !== 'angular.js') {
        var isLocal = false;
        for(var i=0;i<allFiles.length;i++) {
          if(allFiles[i].name == file.name) {
            isLocal = true;
            break;
          }
        }
        if(!(isLocal && !includeLocalFiles)) {
          var assetUrl = angularUrls[file.name] || file.name;
          html += makeScriptTag(assetUrl);
        }
      }
    });

    if(includeLocalFiles) {
      angular.forEach(content.css, function(file, index) {
        html += makeCssLinkTag(file.name);
      });
    }

    return html;


    function makeScriptTag(src) {
      return '<script type="text/javascript" src="' + src + '"></script>\n';
    }

    function makeCssLinkTag(src) {
      return '<link rel="stylesheet" type="text/css" href="' + src + '" />\n';
    }
  };
})


.factory('openPlunkr', function(templateMerge, formPostData, prepareEditorAssetTags, prepareDefaultAppModule) {
  return function(content) {
    var hasRouting = false;
    angular.forEach(content.deps, function(file) {
      hasRouting = hasRouting || file.name == 'angular-route.js';
    });
    var indexHtmlContent = '<!doctype html>\n' +
                           '<html ng-app="{{module}}">\n' +
                           '  <head>\n' +
                           '{{scriptDeps}}';

    if(hasRouting) {
        indexHtmlContent += '<script type="text/javascript">\n' +
                            '//this is here to make plunkr work with AngularJS routing\n' +
                            'angular.element(document.getElementsByTagName(\'head\')).append(' +
                              'angular.element(\'<base href="\' + window.location.pathname + \'" />\')' +
                            ');\n' +
                            '</script>\n';
    }

    indexHtmlContent += '</head>\n' +
                        '  <body>\n\n' +
                        '{{indexContents}}\n\n' +
                        '  </body>\n' +
                        '</html>\n';

    indexProp = {
      module: content.module,
      scriptDeps: prepareEditorAssetTags(content, { includeLocalFiles : true }),
      indexContents: content.html[0].content
    };

    var allFiles = [].concat(content.js, content.css, content.html, content.json);

    if(!content.module) {
      var moduleData = prepareDefaultAppModule(content);
      indexProp.module = moduleData.module;

      var found = false;
      angular.forEach(content.js, function(file) {
        if(file.name == 'script.js') {
          file.content = moduleData.script + file.content;
          found = true;
        }
      });
      if(!found) {
        indexProp.scriptDeps += '<script type="text/javascript" src="script.js"></script>\n';
        allFiles.push({
          name : 'script.js',
          content : moduleData.script
        });
      }
    }

    var postData = {};

    angular.forEach(allFiles, function(file, index) {
      if (file.content && file.name != 'index.html') {
        postData['files[' + file.name + ']'] = file.content;
      }
    });

    postData['files[index.html]'] = templateMerge(indexHtmlContent, indexProp);
    postData['tags[]'] = "angularjs";

    postData.private = true;
    postData.description = 'AngularJS Example Plunkr';

    formPostData('http://plnkr.co/edit/?p=preview', postData);
  };
})

.factory('openJsFiddle', function(templateMerge, formPostData, prepareEditorAssetTags, prepareDefaultAppModule) {
  var HTML = '<div ng-app=\"{{module}}\">\n{{html:2}}</div>',
      CSS = '</style> <!-- Ugly Hack to make remote files preload in jsFiddle --> \n' +
        '{{head:0}}<style>{{css}}',
      SCRIPT = '{{script}}',
      SCRIPT_CACHE = '\n\n<!-- {{name}} -->\n<script type="text/ng-template" id="{{name}}">\n{{content:2}}</script>',
      BASE_HREF_TAG = '<!--  Ugly Hack to make AngularJS routing work inside of jsFiddle -->\n' +
                      '<base href="/" />\n\n';

  return function(content) {
    var prop = {
          module: content.module,
          html: '',
          css: '',
          script: ''
        };
    if(!prop.module) {
      var moduleData = prepareDefaultAppModule(content);
      prop.script = moduleData.script;
      prop.module = moduleData.module;
    }

    angular.forEach(content.html, function(file, index) {
      if (index) {
        prop.html += templateMerge(SCRIPT_CACHE, file);
      } else {
        prop.html += file.content;
      }
    });

    prop.head = prepareEditorAssetTags(content, { includeLocalFiles : false });

    angular.forEach(content.js, function(file, index) {
      prop.script += file.content;
    });

    angular.forEach(content.css, function(file, index) {
      prop.css += file.content;
    });

    var hasRouting = false;
    angular.forEach(content.deps, function(file) {
      hasRouting = hasRouting || file.name == 'angular-route.js';
    });

    var compiledHTML = templateMerge(HTML, prop);
    if(hasRouting) {
      compiledHTML = BASE_HREF_TAG + compiledHTML;
    }
    formPostData("http://jsfiddle.net/api/post/library/pure/", {
      title: 'AngularJS Example',
      html: compiledHTML,
      js: templateMerge(SCRIPT, prop),
      css: templateMerge(CSS, prop)
    });
  };
});

angular.module('docsApp.navigationService', [])

.factory('navigationService', function($window) {
  var service = {
    currentPage: null,
    currentVersion: null,
    changePage: function(newPage) {

    },
    changeVersion: function(newVersion) {

      //TODO =========
    //   var currentPagePath = '';

    // // preserve URL path when switching between doc versions
    // if (angular.isObject($rootScope.currentPage) && $rootScope.currentPage.section && $rootScope.currentPage.id) {
    //   currentPagePath = '/' + $rootScope.currentPage.section + '/' + $rootScope.currentPage.id;
    // }

    // $window.location = version.url + currentPagePath;

    }
  };
});
angular.module('search', [])

.controller('DocsSearchCtrl', ['$scope', '$location', 'docsSearch', function($scope, $location, docsSearch) {
  function clearResults() {
    $scope.results = [];
    $scope.colClassName = null;
    $scope.hasResults = false;
  }

  $scope.search = function(q) {
    var MIN_SEARCH_LENGTH = 3;
    if(q.length >= MIN_SEARCH_LENGTH) {
      var results = docsSearch(q);
      var totalAreas = 0;
      for(var i in results) {
        ++totalAreas;
      }
      if(totalAreas > 0) {
        $scope.colClassName = 'cols-' + totalAreas;
      }
      $scope.hasResults = totalAreas > 0;
      $scope.results = results;
    }
    else {
      clearResults();
    }
    if(!$scope.$$phase) $scope.$apply();
  };
  $scope.submit = function() {
    var result;
    for(var i in $scope.results) {
      result = $scope.results[i][0];
      if(result) {
        break;
      }
    }
    if(result) {
      $location.path(result.url);
      $scope.hideResults();
    }
  };
  $scope.hideResults = function() {
    clearResults();
    $scope.q = '';
  };
}])

.factory('lunrSearch', function() {
  return function(properties) {
    if (window.RUNNING_IN_NG_TEST_RUNNER) return null;

    var engine = lunr(properties);
    return {
      store : function(values) {
        engine.add(values);
      },
      search : function(q) {
        return engine.search(q);
      }
    };
  };
})

.factory('docsSearch', ['$rootScope','lunrSearch', 'NG_PAGES',
    function($rootScope, lunrSearch, NG_PAGES) {
  if (window.RUNNING_IN_NG_TEST_RUNNER) {
    return null;
  }

  var index = lunrSearch(function() {
    this.ref('id');
    this.field('title', {boost: 50});
    this.field('keywords', { boost : 20 });
  });

  angular.forEach(NG_PAGES, function(page, key) {
    if(page.searchTerms) {
      index.store({
        id : key,
        title : page.searchTerms.titleWords,
        keywords : page.searchTerms.keywords
      });
    };
  });

  return function(q) {
    var results = {
      api : [],
      tutorial : [],
      guide : [],
      error : [],
      misc : []
    };
    angular.forEach(index.search(q), function(result) {
      var key = result.ref;
      var item = NG_PAGES[key];
      var area = item.area;
      item.path = key;

      var limit = area == 'api' ? 40 : 14;
      if(results[area].length < limit) {
        results[area].push(item);
      }
    });
    return results;
  };
}])

.directive('focused', function($timeout) {
  return function(scope, element, attrs) {
    element[0].focus();
    element.on('focus', function() {
      scope.$apply(attrs.focused + '=true');
    });
    element.on('blur', function() {
      // have to use $timeout, so that we close the drop-down after the user clicks,
      // otherwise when the user clicks we process the closing before we process the click.
      $timeout(function() {
        scope.$eval(attrs.focused + '=false');
      });
    });
    scope.$eval(attrs.focused + '=true');
  };
})

.directive('docsSearchInput', ['$document',function($document) {
  return function(scope, element, attrs) {
    var ESCAPE_KEY_KEYCODE = 27,
        FORWARD_SLASH_KEYCODE = 191;
    angular.element($document[0].body).bind('keydown', function(event) {
      var input = element[0];
      if(event.keyCode == FORWARD_SLASH_KEYCODE && document.activeElement != input) {
        event.stopPropagation();
        event.preventDefault();
        input.focus();
      }
    });

    element.bind('keydown', function(event) {
      if(event.keyCode == ESCAPE_KEY_KEYCODE) {
        event.stopPropagation();
        event.preventDefault();
        scope.$apply(function() {
          scope.hideResults();
        });
      }
    });
  };
}]);

angular.module('tutorials', [])

.directive('docTutorialNav', function(templateMerge) {
  var pages = [
    '',
    'step_00', 'step_01', 'step_02', 'step_03', 'step_04',
    'step_05', 'step_06', 'step_07', 'step_08', 'step_09',
    'step_10', 'step_11', 'step_12', 'the_end'
  ];
  return {
    compile: function(element, attrs) {
      var seq = 1 * attrs.docTutorialNav,
          props = {
            seq: seq,
            prev: pages[seq],
            next: pages[2 + seq],
            diffLo: seq ? (seq - 1): '0~1',
            diffHi: seq
          };

      element.addClass('btn-group');
      element.addClass('tutorial-nav');
      element.append(templateMerge(
        '<a href="tutorial/{{prev}}"><li class="btn btn-primary"><i class="icon-step-backward"></i> Previous</li></a>\n' +
        '<a href="http://angular.github.com/angular-phonecat/step-{{seq}}/app"><li class="btn btn-primary"><i class="icon-play"></i> Live Demo</li></a>\n' +
        '<a href="https://github.com/angular/angular-phonecat/compare/step-{{diffLo}}...step-{{diffHi}}"><li class="btn btn-primary"><i class="icon-search"></i> Code Diff</li></a>\n' +
        '<a href="tutorial/{{next}}"><li class="btn btn-primary">Next <i class="icon-step-forward"></i></li></a>', props));
    }
  };
})


.directive('docTutorialReset', function() {
  function tab(name, command, id, step) {
    return '' +
      '  <div class=\'tab-pane well\' title="' + name + '" value="' + id + '">\n' +
      '    <ol>\n' +
      '      <li><p>Reset the workspace to step ' + step + '.</p>' +
      '        <pre>' + command + '</pre></li>\n' +
      '      <li><p>Refresh your browser or check the app out on <a href="http://angular.github.com/angular-phonecat/step-' + step + '/app">Angular\'s server</a>.</p></li>\n' +
      '    </ol>\n' +
      '  </div>\n';
  }

  return {
    compile: function(element, attrs) {
      var step = attrs.docTutorialReset;
      element.html(
        '<div ng-hide="show">' +
          '<p><a href="" ng-click="show=true;$event.stopPropagation()">Workspace Reset Instructions  ➤</a></p>' +
        '</div>\n' +
        '<div class="tabbable" ng-show="show" ng-model="$cookies.platformPreference">\n' +
          tab('Git on Mac/Linux', 'git checkout -f step-' + step, 'gitUnix', step) +
          tab('Git on Windows', 'git checkout -f step-' + step, 'gitWin', step) +
        '</div>\n');
    }
  };
});

angular.module('versions', [])

.controller('DocsVersionsCtrl', ['$scope', '$location', '$window', 'NG_VERSIONS', function($scope, $location, $window, NG_VERSIONS) {
  $scope.docs_versions = NG_VERSIONS;
  $scope.docs_version  = NG_VERSIONS[0];

  $scope.jumpToDocsVersion = function(version) {
    var currentPagePath = $location.path();

    // TODO: We need to do some munging of the path for different versions of the API...
    

    $window.location = version.docsUrl + currentPagePath;
  };
}]);