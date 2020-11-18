const Hapi = require('hapi')
const Path=require('path')
const db=require('./models')
const Author=db.authors
const Task=db.tasks

// db.sequelize.sync();
db.sequelize.sync({ force: false }).then(() => {
  console.log("Table Created");
});


const init = async () => {
  //Init server
  const server = new Hapi.server({
    port: 5000,
    host: 'localhost',
  })

  //Post Author route
  server.route({
    method: 'POST',
    path: '/authors',
    handler: async (req, h) => {
      let { name, description } = req.payload
       try {
        let author= await Author.create({ name,description})
        return h.response(author).code(201)
       } catch (error) {
         console.log(error);
       }
  }
  })


    //Post Task route
    server.route({
      method: 'POST',
      path: '/tasks',
      handler: async (req, h) => {
        let { title, details,authorId } = req.payload
         try {
          let task= await Task.create({ title,details, authorId})
          return h.response(task).code(201)
         } catch (error) {
           console.log(error);
         }
    }
    })


  // Get all authors
  server.route({
    method: 'GET',
    path: '/authors',
    handler: async (req, h) => {
        try {
    
          let authors= await Author.findAll({include:["tasks"]})
          console.log(authors);
          return authors
        } catch (error) {
          console.log(error);
        }
    }
  })

    //Get task details
    server.route({
      method: 'GET',
      path: '/tasks/{id}',
      handler: async (req, h) => {
          try {
            let {id}=req.params
            let details= await Task.findByPk(id);
            return h.response(details).code(200)
          } catch (error) {
            console.log(error);
          }
      }
    })

    //PUT task details
    server.route({
      method: 'PUT',
      path: '/tasks/{id}',
      handler: async (req, h) => {
        let {id}=req.params
        let {title, details, authorId} = req.payload 
         try {
           console.log(title,details,authorId);
          // let author=await Author.findOne({ where: { name } });
          // let authorId=author.dataValues.id
          let updatedTask=await Task.update({ title,details,authorId}, {
            where: {
              id
            }
          })  
          return h.response(updatedTask).code(200)
           
         } catch (error) {
           console.log(error);
         }      
    
      }
    })

        //Delete task 
        server.route({
          method: 'DELETE',
          path: '/tasks/{id}',
          handler: async (req, h) => {
            let {id}=req.params
           try {
            await Task.destroy({
              where: {
                id
              }
            })
            return h.response().code(200)
           } catch (error) {
             console.log(error);
           }     
           
          }
        })

        // Get author with task
        server.route({
          method: 'GET',
          path: '/author/{id}',
          handler: async (req, h) => {
              try {
                let {id}=req.params
                let author=await Author.findByPk(id, { include: ["tasks"] })
                return h.response(author).code(200)
              } catch (error) {
                console.log(error);
              }
          }
        })
        //PUT author details
        server.route({
          method: 'PUT',
          path: '/author/{id}',
          handler: async (req, h) => {
            let {id}=req.params
            let { name, description } = req.payload 
             try {
          
              let updatedAuthor=await Author.update({ name, description }, {
                where: {
                  id
                }
              })  
              return h.response(updatedAuthor).code(200)
               
             } catch (error) {
               console.log(error);
             }      
        
          }
        })
         //Delete author 
         server.route({
          method: 'DELETE',
          path: '/author/{id}',
          handler: async (req, h) => {
            let {id}=req.params
           try {
            await Author.destroy({
              where: {
                id
              }
            })
            return h.response().code(200)
           } catch (error) {
             console.log(error);
           }     
           
          }
        })
          // Get amount of task with member
          server.route({
            method: 'GET',
            path: '/member',
            handler: async (req, h) => {
                try {
            
                  let author= await Author.findAll({include:["tasks"]})
                
                  let ob=[]
                  for(const a of author )
                  {
                    let name=a.dataValues.name
                    let authorId=a.dataValues.id
                    let counter = 0;
                    for (const obj of a.dataValues.tasks) {
                      counter++;
                    }
                    ob.push({name:name,task:counter, authorId})
                  }
                  
                  console.log(ob);
                  return h.response(ob).code(200)
                } catch (error) {
                  console.log(error);
                }
            }
          })
    

  await server.start()

  console.log(`Server is running on ${server.info.uri}`)
}

init().catch(err => console.log(err))
