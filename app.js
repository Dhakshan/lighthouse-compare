
const express = require('express');
const morgan = require('morgan');
const lighthouseApp = require('./public/js/lighthouse');

const app = express();
//register view engine
app.set('view engine', 'ejs');

//middleware for js, css, images includes from public
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));

app.listen("3232");

//third party middleware
app.use(morgan('dev'));

app.use((req, res, next) => {
    const { hostname, path, method } = req;
    console.log(hostname, path, method);
    next();
});

app.get('/', (req, res) => {
    res.render('index', {
        data: {
            title: "Home"
        }
    });
});
const cloneObject = function(json){
    return JSON.parse(JSON.stringify(json));
}
app.get('/compare', (req, res) => {
    res.redirect("/");
});
app.post('/compare', (req, res) => {
    console.log(req.body);
    var formjson = req.body.lh, compare = {
        msg: "",
        formjson: cloneObject(req.body)
    };
    var headerSerialize = function(header){
        var newHeader = {};
        for(var i in header){
            var iobj = header[i];
            if(iobj && iobj.key && iobj.value){
                newHeader[iobj.key] = iobj.value||"";
            }
        }
        return newHeader;
    }
    formjson[0].header = headerSerialize(formjson[0].header),formjson[1].header = headerSerialize(formjson[1].header);
    
    var results = lighthouseApp.init({
        lh: [formjson[0], formjson[1]], maxRun: formjson.length, complete: function (results) {
            console.log(results);
            res.render('index', {
                data: {
                    title: "Home",
                    compare: compare,
                    lighthouse : results||{}
                }
            });
        }
    });

})

//404 page
app.use((req, res) => {
    res.status(404).render('404', {
        data: {
            title: "404"
        }
    });
})