    const path = require('path');

    const express = require('express');
    const bodyParser = require('body-parser');
    const mongoose = require('mongoose');

    const errorController = require('./controllers/error');
    // const mongoConnect  = require('./util/database').mongoConnect;
    const User = require('./models/user');

    const app = express();

    app.set('view engine', 'ejs');
    app.set('views', 'views');

    const adminRoutes = require('./routes/admin');
    const shopRoutes = require('./routes/shop');

    app.use(bodyParser.urlencoded({
        extended: false
    }));
    app.use(express.static(path.join(__dirname, 'public')));

    app.use((req, res, next) => {
        User.findById('651556d790c599e716332e7c')
            .then(user => {
                req.user = user
                next();
            })
            .catch(err => {
                console.log(err)
            })
    })

    app.use('/admin', adminRoutes);
    app.use(shopRoutes);
    app.use(errorController.get404);

    mongoose.connect('mongodb+srv://shababidevi99:eVlCojMDKRlUr6xb@cluster0.dycfpyt.mongodb.net/Ecommerce?retryWrites=true&w=majority')
        .then(result => {
            console.log("Successfully Connected To Database")
            User.findOne()
                .then(user => {
                    if (!user) {
                        const user = new User({
                            name: "Arbind Kumar Sah",
                            email: "SHa.arvind99@gmail.com",
                            phoneNum: "9808593382",
                            cart: {
                                items: []
                            }
                        })

                        user.save();
                    }
                })
            app.listen(3000)
        })
        .catch(err => {
            console.log(err)
        })