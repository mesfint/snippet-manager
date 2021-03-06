import User from "../model/user.js";

//get All users
export function getAll(req, res) {
  if (!req.session.user.isAdmin) {
    res.render("pages/index", {
      message: "Unauthrized page",
      type: "error",
      snippets: req.session.snippets,
      user: req.session.user,
    });
  } else {
    User.find((err, response) => {
      if (err) {
        res.render("includes/show_message", {
          message: "No User found",
          type: "error",
          snippets: [],
        });
      } else {
        console.log(req.session.user, "session from users");
        res.render("pages/users", {
          message: "Persons retrieved",
          type: "success",
          users: response.sort().reverse(),
          user: req.session.user,
        });
      }
    });
  }
}
// login register
export function registerForm(req, res) {
  res.render("pages/register");
}

//register user
export function register(req, res) {
  const userInfo = req.body; //get the parsed information

  if (!userInfo.email || !userInfo.password || !userInfo.confirm_password) {
    res.render("pages/register", {
      message: "Please fill email, password , and confirm password fields",
      type: "error",
    });
  } else {
    if (userInfo.password !== userInfo.confirm_password) {
      res.render("pages/register", {
        message: "Password doesn't match",
        type: "error",
      });
    } else {
      const newUser = new User({
        email: userInfo.email,
        password: userInfo.password,
      });
      newUser.save((err, response) => {
        if (err) {
          res.render("pages/register", {
            message: "Error saving user to db",
            type: "error",
          });
        } else {
          res.redirect("/");
          /* res.render("includes/show_message", {
            message: "New user added",
            type: "success",
            user: response,
          }); */
        }
      });
    }
  }
}

// login form
export function loginForm(req, res) {
  res.render("pages/login");
}

//login in user
export function login(req, res) {
  const { email, password } = req.body;
  if (!email || !password) {
    res.render("pages/login", {
      message: "Please provide email and password *  ",
      type: "error",
    });
  } else {
    User.findOne({ email: email }).exec(function (error, user) {
      if (error) {
        //callback({error: true})
        res.render("pages/login", {
          message: "There is error " + error,
          type: "error",
        });
      } else if (!user) {
        //callback({error: true})
        res.render("pages/login", {
          message: "User is not found",
          type: "error",
        });
      } else {
        /*  console.log(user) */
        user.comparePassword(password, function (matchError, isMatch) {
          if (matchError) {
            //callback({error: true})
            res.render("pages/login", {
              message: "Password matching error" + matchError,
              type: "error",
            });
          } else if (!isMatch) {
            //callback({error: true})
            res.render("pages/login", {
              message: "Password dosn't match",
              type: "error",
            });
          } else {
            //callback({success: true})
            //set user as a session
            if (!req.session.user) {
              const { _id, email, isAdmin } = user;
              req.session.user = { _id, email, isAdmin };
              req.session.login = true;
              res.render("pages/index", {
                message:
                  "You are successfully logged in! Welcome " + user.email,
                type: "success",
                user: { _id, email, isAdmin },
                snippets: req.session.snippets,
              });
            }
          }
        });
      }
    });
  }
}

export function logout(req, res) {
  /* User.findOne({id: req.params.id}).exec(function(error, user) {
    if (error) {
      //callback({error: true})
      res.render("pages/login", {
        message: "There is error " + error,
        type: "error",
      });
    }else{ */
    console.log('logout clided')
  if (req.session.user && req.session.login) {
    delete req.session.user;
    //req.session.user = null
    req.session.login = false;
    res.redirect("/");
  }
}
