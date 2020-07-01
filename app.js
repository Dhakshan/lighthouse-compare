
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

app.post('/compare', (req, res) => {
    console.log(req.body);
    let firstUrl = req.body.firstUrl, secondUrl = req.body.secondUrl;
    let compare = {
        msg: "",
        formjson: req.body
    };
    if (firstUrl == "" && secondUrl == "") {
        compare.msg = "Please enter 2 url to compare";
    }
    let results = lighthouseApp.init({
        url: [firstUrl, secondUrl], maxRun: 2, complete: function (results) {
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