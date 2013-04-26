if (typeof Mustache === 'undefined') {
  throw '[template.js] Mustache is needed to use template.js. Please import it';
}
var Template = (function() {
  var firstSelector = 'template:first, script[type="text/html-template"]:first, [data-type=template]:first';
  var errorMessage = function(id) {
    return '[template.js] An error occured, template with id: "' + id + '" does not exist';
  };
  var errorJquery = function(selector, id) {
    return '[template.js] An error occured while creating template: new Template("' + id + '"), possible wrong jQuery selector ( ' + selector + ' )';
  };
  var idSelector = function(id) {
    return Mustache.render('template#{{id}}, script[type="text/html-template"]#{{id}}, [data-type=template]#{{id}}', {id: id});
  };
  var Template = function(id) {
    var errors = [];
    var htmlTemplate = '';
    if (typeof id === 'undefined') {
      var asTemplate = [];
      try {
        asTemplate = $(firstSelector);
      } catch(e) { errors.push(errorJquery(firstSelector, id)); console.error(e); }
      if (asTemplate.length > 0) {
        htmlTemplate = asTemplate.first().html();
      } 
    } else if (typeof id === 'object') {
      if (typeof id.url !== 'undefined') {
        $.ajax({ type: "GET", url: id.url, async: false, success: function(data) { htmlTemplate = data; } });
      } else if (typeof id.templateContent !== 'undefined') {
        htmlTemplate = id.templateContent;
      }
    } else {
      var jquerySelector = [];
      try { jquerySelector = $(id); } catch(e) { errors.push(errorJquery(id, id)); console.error(e); }
      if (jquerySelector.length > 0) {
        htmlTemplate = jquerySelector.first().html();
      } else {
        var asTemplate = [];
        var selector = idSelector(id);
        try {
          asTemplate = $(selector);
        } catch(e) { errors.push(errorJquery(selector, id)); console.error(e); }
        if (asTemplate.length > 0) {
          htmlTemplate = asTemplate.first().html();
        }
      }
    }
    if (0 === htmlTemplate.length && 0 === errors.length) { errors.push(errorMessage(id)); }
    if (errors.length > 0) { htmlTemplate = errors.join('<br/>'); }
    return {
      renderWith: function(view, partials) {
        return Mustache.render(htmlTemplate, view, partials);
      },
      compile: function() {
        return Mustache.compile(htmlTemplate);
      }
    };
  };

  if (typeof jQuery !== 'undefined') {
    (function($) {
      function errorTemplate(id) {
        return {
          renderWith: function() {
            return errorMessage(url);
          }
        };
      }
      $.fn.templateFrom = function(url) {
        var current = $(this);
        var theTemplate = errorTemplate(url);
        if (typeof url === 'undefined') {
          theTemplate = Template();
        } else {
          theTemplate = Template({url: url});
        } 
        return {
          renderWith: function(view1, partials1) {
            return current.html(theTemplate.renderWith(view1, partials1));
          }
        };
      };
      $.fn.templateOf = function(template) {
        var current = $(this);
        var theTemplate = errorTemplate(template);
        if (typeof template === 'undefined') {
          theTemplate = Template();
        } else {
          theTemplate = Template({templateContent: template});
        } 
        return {
          renderWith: function(view1, partials1) {
            return current.html(theTemplate.renderWith(view1, partials1));
          }
        };
      };
      $.fn.template = function(template, view, partials) {
        var current = $(this);
        var theTemplate = errorTemplate(template);
        if (typeof template === 'undefined') {
          theTemplate = Template();
        } else if(typeof template === 'string') {
          theTemplate = Template(template);
        } else {
          theTemplate = template;
        }
        if (typeof view === 'undefined') {
          return {
            renderWith: function(view1, partials1) {
              return current.html(theTemplate.renderWith(view1, partials1));
            }
          };
        } else {
          return current.html(theTemplate.renderWith(view, partials));
        }
      };
    })(jQuery);
  }
  return Template;
})();