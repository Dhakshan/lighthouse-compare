function dot(p, f) {
    var s = this.dot ||
        function () {
        };
    if (typeof s[p] === "function") {
        var arg = Array.prototype.slice.call(arguments);
        arg = arg.slice(1, arg.length);
        var apply = s[p].apply(this, arg);
        return apply;
    } else if (typeof s[p] === "boolean" || typeof s[p] === "object" || typeof s[p] === "string" || typeof s[p] === "number" || typeof s[p] === "regex") {
        return s[p];
    } else {
        var definition = function (w, k, v) {
            w[k] = v;
        };
        definition(s, p, f), this.dot =
            s;
        return s;
    }
}

dot("update", function (param, data) {
    if (typeof param === "string") {
        this.dot[param] = data;
        return this.dot["param"];
    }
});
dot("data runfn", function () {
    $(".dont [data-runfn]").addClass("-runfn");
    $("[data-runfn]").each(function () {
        var run = $(this),
            data = {
                fn: run.data("runfn"),
                called: run.hasClass("-runfn"),
                dont: run.hasClass("dont")
            };
        if (!data.called) {
            run.addClass("-runfn").data("runfn", data);

            if (!data.dont || !data.iseditor) {
                dot(data.fn, run);
            }
        }
    });
});

dot("dataobject", function (options) {
    options.string = (!options.string && $(options).length) ? $(options).data("object") : options.string;
    if (options && options.string) {
        var string = options.string,
            stringSplit = (string.match(/\|/g)) ? string.split(/\|/g) : (string.match(/^$|undefined/)) ? [] : [string],
            i,
            cnt = 0,
            newObject = {};
        for (i in stringSplit) {
            var autokeyname = "key" + cnt,
                data = stringSplit[i];
            var dataSplit = (data.match(/\:/g)) ? data.split(/\:/) : [autokeyname, data];
            if (newObject[dataSplit[0]]) {
                newObject[dataSplit[0]] = newObject[dataSplit[0]] + "," + dataSplit[1];
            } else {
                newObject[dataSplit[0]] = dataSplit[1];
            }
        }
        this.output = newObject;
        return newObject;
    }
});
dot("handlebar", function (_obj) {
    var obj = _obj;
    var id = (typeof obj.id === "string") ? $(obj.id) : obj.id;
    if (id.length) {
        var source = obj.templatehtml || $(obj.template).html();
        var template = Handlebars.compile(source);
        if (obj.json) {
            id[obj.print || "html"](template(obj.json));
        } else {
            id[obj.print || "html"](template());
        }
        if (typeof obj.complete === "function")
            obj.complete(obj);
    }
});
dot("handlebar helpers", function () {
    
    Handlebars.registerHelper('lowercase', function (str) {
        return String(str).toLowerCase();
    });
    Handlebars.registerHelper('isEachStart', function (current, options) {
        if (!current) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('isIndexNotZero', function (current, options) {
        if (current) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('isEachEnd', function (list, current, options) {
        if (list.length - 1 == current) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('isLength', function (list, flag, options) {
        if (!flag && !list) {
            return options.fn(this);
        }
        if (flag && list && list.length) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('IfCondition', function (data, type, options) {
        if (data == type) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('IfNotCondition', function (data, type, options) {
        if (!(data == type)) {
            return options.fn(this);
        }
    });
    Handlebars.registerHelper('IfString', function (data, type, value, options) {
        if (data == type) {
            return value;
        }
    });
    Handlebars.registerHelper('plusPlus', function (count, flag) {
        return count + flag
    });
    Handlebars.registerHelper('printAttr', function (flag, text, empty) {
        text = Handlebars.escapeExpression(text);
        return (String(flag).match(/true|1|y/i)) ? new Handlebars.SafeString(text) : empty;
    });
    Handlebars.registerHelper('iskey', function (flag, text, empty) {
        text = Handlebars.escapeExpression(text);
        return (String(flag).match(/undefined|null/i)) ? empty : new Handlebars.SafeString(text);
    });
});
dot("compile", function (param) {
    var setting = dot("dataobject", param), fn;
    window[setting.keynameofjson] = window[setting.keynameofjson] || {};
    window[setting.keynameofjson].formid = setting.id;
    fn = {
        compiler: {
            keynameofjson:setting.keynameofjson,
            json: window[setting.keynameofjson], complete: function (setting) {
                dot("data runfn");
                if(setting.keynameofjson){
                    dot(setting.keynameofjson,setting);
                }
            }
        }
    };
    var setting = $.extend({id:setting.id,template:setting.template}, fn.compiler, dot("dataobject", $(setting.id)));
    dot("handlebar", setting);
});
dot("formjson",function(setting){
    // console.log(setting);
    $(document).off("click",".delete_btn").on("click",".delete_btn",function(){
        var self = $(this), dataset = dot("dataobject",self);
        var json = window[dataset.keynameofjson]||false;
        if(json && json.lh){
            var header = json.lh[dataset.urlAt].header;
            if(header.length>1){
                header.splice(dataset.headerAt,1);
            }else{
                header[dataset] = json.newHeader;
            }
            json.lh[dataset.urlAt].headerOnAt = dataset.urlAt;
            json.lh[dataset.urlAt].header = header;
        }
        window[dataset.keynameofjson] =json;
        setting.json = window[dataset.keynameofjson];
        dot("handlebar", setting);
    });
    $(document).off("click",".add_btn").on("click",".add_btn",function(){
        var self = $(this), dataset = dot("dataobject",self);
        var json = window[dataset.keynameofjson]||false;
        if(json && json.lh){
            var header = json.lh[dataset.urlAt].header;
            header.push(json.newHeader);
            json.lh[dataset.urlAt].header = header;
            json.lh[dataset.urlAt].headerOnAt = dataset.urlAt;
        }
        window[dataset.keynameofjson] = json;
        setting.json = window[dataset.keynameofjson];
        // console.log(setting);
        dot("handlebar", setting);
    });
});

dot("headerfixed", function (param) {
    var data = $.extend({}, { "addclass": "enable-bg", "hideondown": false }, {});
    var scrollpos = [];
    var dostuff = function (param) {
        var scrolltop = $(window).scrollTop();
        var h = param.height();
        $("body").css({
            "padding-top": h + "px"
        });
        var top = "0px";
        if (String(data.hideondown).match(/true/ig)) {
            if (scrollpos.length > 2 && scrollpos[1] < scrolltop) {
                top = -h + "px";
                scrollpos.pop();
            }
        }
        param.css({
            "top": top
        });
        if ($(".header-touch").length) {
            $(".header-touch").css({ "margin-top": -h, "padding-top": h + 50 });
        }
        if (scrolltop > h) {
            param.addClass(data.addclass);
        } else {
            param.removeClass(data.addclass);
        }
        scrollpos.unshift(scrolltop);
    };
    dostuff(param);
    $(window).on("scroll", function () {
        dostuff(param);
    });
});
dot("urlSetting", function () {
    $(".progress-bar-control").hide();
    $("#compareForm").on("submit", function () {
        $(".progress-bar-control").show();
    });
    $("[data-setting-nav]").on("click", function () {
        var self = $(this), ref = self.data("setting-nav"), content = $("[data-setting-content='" + ref + "']");
        $("[data-setting-content]").not(content).removeClass("on").hide();
        content.toggleClass("on").show();
        self.toggleClass("on");
    });
})

$(document).ready(function () {
    dot("handlebar helpers");
    dot("data runfn");
    dot("urlSetting")
});