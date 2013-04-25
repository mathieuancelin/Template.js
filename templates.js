var Template = function(id) {
  var htmlTemplate = 'An error occured, template "' + id + '" does not exist';
  if (typeof id === 'undefined') {
    var asTemplate = $('template:first');
    var asScript = $('script[type="text/html-template"]:first');
    var asTemplateType = $('[data-type=template]:first');
    if (asTemplate.length > 0) {
      htmlTemplate = asTemplate.html();
    } else if (asScript.length > 0) {
      htmlTemplate = asScript.html();
    } else if (asTemplateType.length > 0) {
      htmlTemplate = asTemplateType.html();
    }
  } else {
    var jquerySelector = $(id);
    if (jquerySelector.length > 0) {
      htmlTemplate = jquerySelector.html();
    } else {
      var asTemplate = $('template#' + id);
      var asScript = $('script[type="text/html-template"]#' + id);
      var asTemplateType = $('[data-type=template]#' + id);
      if (asTemplate.length > 0) {
        htmlTemplate = asTemplate.html();
      } else if (asScript.length > 0) {
        htmlTemplate = asScript.html();
      } else if (asTemplateType.length > 0) {
        htmlTemplate = asTemplateType.html();
      } 
    }
  }
  return {
    renderWith: function(view, partials) {
      return Mustache.render(htmlTemplate, view, partials);
    }
  };
};

if (typeof jQuery !== 'undefined') {
  (function($) {
    $.fn.template = function(template, view, partials) {
      var current = $(this);
      var theTemplate = {
        renderWith: function() {
          return 'An error occured, template "' + template + '" does not exist';
        }
      };
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