const users = []
const bcryptjs = require('bcryptjs')

module.exports = {
  login: (req, res) => {
      console.log('Logging In User')
      console.log(req.body)
      const { username, password } = req.body;
      let userData;
      for (const user of users) {
          if (user.username === username){
            userData = {...user}// userData = user   this will give error when the same user logs in the second time as the pwd will get deleted. as we will be deleting the pwd from userdata before sending it to front end you want to create a new pbject and just dont want ro juse = to it or point to it, then when we delete it, it will delete it from the user obj too 
            console.log("user found");
          }
      }
      
      if(!userData){
        console.log("user not found");
        res.status(400).send({message: "User name not found"})
      }else{
        // user found, now we will check the pwd is correct by comparing the encrypted version
        console.log("start comparing the user entered pwd and the encrypted pwd found");
        const authenticated = bcryptjs.compareSync(password, userData.passwordHash)
        console.log(authenticated);
          if (authenticated) {
            
            console.log("pwd authentication success");
            delete userData.passwordHash
            res.status(200).send(userData)
          }else{
            console.log("Error during bcrypt compare(): Authentication failed" + authenticated)
            res.status(400).send({message:"Passwords do not match"})
          }
      }
  },

    register: (req, res) => {
        console.log(req.body);
        const { username, email, firstName, lastName,password } = req.body;
        if (users.length>0){
          for (let i = 0; i < users.length; i++) {
            if(username === users[i].username ){
              console.log("User already exists");
              res.status(400).send("User name  already ")
            }
          }
        }
        console.log('Registering User')
        const saltRounds=10;
        const passwordHash = bcryptjs.hashSync(password, saltRounds)
        //bcryptjs.hash(password, saltRounds, (err, //passwordHash)=>{ this is better as it is async and does not block the rest of code from running simultaneously
          let newDatabaseEntry={};
          newDatabaseEntry.username = username
          newDatabaseEntry.firstName = firstName
          newDatabaseEntry.lastName = lastName
          newDatabaseEntry.email = email //first key value
          newDatabaseEntry.passwordHash = passwordHash;
          console.log('\nNew database entry: ');
          console.log(newDatabaseEntry)
          users.push(newDatabaseEntry)
          delete req.body.password;// no sending password to the fronend as its a sensitive. we already saved the hashed pwd in the newDatabaseEntry obj
         res.status(200).send(req.body)
       //})
          
    }        
      
  }
// you can also do a asynch method for login too 
// bcryptjs.compare(password, userData.password, ((err,result)=> {
//   if (err) {
    // Handle the error
  //   console.error(err);
  //   return;
  // }

  // if (result === true) {
  //   // Passwords match
  //   console.log("Password is correct");
  // } else {
  //   // Passwords don't match
  //   console.log("Password is incorrect");
  // }
// }
// ))

// err: This parameter is used to handle any potential errors that occur during the comparison process. If an error occurs, such as an invalid argument or an issue with the hashing algorithm, the err parameter will contain information about the error. You can use this parameter to handle and log errors appropriately.

// result: This parameter indicates the result of the password comparison. It will be a boolean value (true or false). If the password matches the hashed userData.password, the result will be true. Otherwise, if the passwords don't match, the result will be false. 