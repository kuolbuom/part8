require("dotenv").config();

const { GraphQLError } = require("graphql");
const jwt = require("jsonwebtoken");
const User = require("./models/user");

const Book = require("./models/book");
const Author = require("./models/author");

const JWT_SECRET = process.env.JWT_SECRET;
console.log("JWT_SECRET", JWT_SECRET);

// let authors = [
//   {
//     name: "Robert Martin",
//     id: "afa51ab0-344d-11e9-a414-719c6709cf3e",
//     born: 1952,
//   },
//   {
//     name: "Martin Fowler",
//     id: "afa5b6f0-344d-11e9-a414-719c6709cf3e",
//     born: 1963,
//   },
//   {
//     name: "Fyodor Dostoevsky",
//     id: "afa5b6f1-344d-11e9-a414-719c6709cf3e",
//     born: 1821,
//   },
//   {
//     name: "Joshua Kerievsky", // birthyear not known
//     id: "afa5b6f2-344d-11e9-a414-719c6709cf3e",
//   },
//   {
//     name: "Sandi Metz", // birthyear not known
//     id: "afa5b6f3-344d-11e9-a414-719c6709cf3e",
//   },
// ];
/*
 * Suomi:
 * Saattaisi olla järkevämpää assosioida kirja ja sen tekijä tallettamalla kirjan yhteyteen tekijän nimen sijaan tekijän id
 * Yksinkertaisuuden vuoksi tallennamme kuitenkin kirjan yhteyteen tekijän nimen
 *
 * English:
 * It might make more sense to associate a book with its author by storing the author's id in the context of the book instead of the author's name
 * However, for simplicity, we will store the author's name in connection with the book
 *
 * Spanish:
 * Podría tener más sentido asociar un libro con su autor almacenando la id del autor en el contexto del libro en lugar del nombre del autor
 * Sin embargo, por simplicidad, almacenaremos el nombre del autor en conexión con el libro
 */

/*
  you can remove the placeholder query once your first one has been implemented 
*/
// let books = [
//   {
//     title: "Clean Code",
//     published: 2008,
//     author: "Robert Martin",
//     id: "afa5b6f4-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Agile software development",
//     published: 2002,
//     author: "Robert Martin",
//     id: "afa5b6f5-344d-11e9-a414-719c6709cf3e",
//     genres: ["agile", "patterns", "design"],
//   },
//   {
//     title: "Refactoring, edition 2",
//     published: 2018,
//     author: "Martin Fowler",
//     id: "afa5de00-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring"],
//   },
//   {
//     title: "Refactoring to patterns",
//     published: 2008,
//     author: "Joshua Kerievsky",
//     id: "afa5de01-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "patterns"],
//   },
//   {
//     title: "Practical Object-Oriented Design, An Agile Primer Using Ruby",
//     published: 2012,
//     author: "Sandi Metz",
//     id: "afa5de02-344d-11e9-a414-719c6709cf3e",
//     genres: ["refactoring", "design"],
//   },
//   {
//     title: "Crime and punishment",
//     published: 1866,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de03-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "crime"],
//   },
//   {
//     title: "Demons",
//     published: 1872,
//     author: "Fyodor Dostoevsky",
//     id: "afa5de04-344d-11e9-a414-719c6709cf3e",
//     genres: ["classic", "revolution"],
//   },
// ];

const resolvers = {
  //query resolver
  Query: {
    bookCount: async () => {
      return await Book.countDocuments({});
    },
    // bookCount: () => books.length,
    allBooks: async (root, args) => {
      const filter = {};

      if (args.author) {
        const author = await Author.findOne({
          name: args.author,
        });

        if (!author) {
          return [];
        }

        filter.author = author._id;
      }

      if (args.genre) {
        filter.genres = args.genre;
      }

      return Book.find(filter).populate("author");
    },
    // allBooks: (root, args) => {
    //   let result = books;

    //   if (args.author) {
    //     result = result.filter((book) => book.author === args.author);
    //   }

    //   if (args.genre) {
    //     result = result.filter((book) => book.genres.includes(args.genre));
    //   }

    //   return result;
    // },

    findBook: async (root, args) => {
      return await Book.findOne({
        title: args.title,
      }).populate("author");
    },
    //  books.find((b) => b.title === args.title),
    authorCount: async () => {
      return await Author.countDocuments({});
    },
    // authorCount: () => authors.length,
    allAuthors: async () => {
      return Author.find({});
    },
    // allAuthors: () => authors,
    findAuthor: async (root, args) => {
      return await Author.findOne({
        name: args.name,
      });
    },
    // authors.find((a) => a.name === args.name),
    me: (root, args, context) => {
      return context.currentUser;
    },
  },
  //Exercise 3. All author
  Author: {
    bookCount: async (root) => {
      return await Book.countDocuments({
        author: root._id,
      });
      // return books.filter((book) => book.author === root.name).length;
    },
  },

  //mutation resolvers
  Mutation: {
    addBook: async (root, args, context) => {
      //Protect addBook
      console.log("Context:", context);
      console.log("Current user:", context.currentUser);

      const currentUser = context.currentUser;

      if (!context.currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "UNAUTHENTICATED",
          },
        });
      }

      try {
        //query from database
        let author = await Author.findOne({
          name: args.author,
        });

        //if author does not exist
        if (!author) {
          author = new Author({
            name: args.author,
          });

          await author.save();
        }

        //create a book
        const book = new Book({
          title: args.title,
          published: args.published,
          genres: args.genres,
          author: author._id,
        });

        await book.save();

        return book.populate("author");
        //   if (!author) {
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }

      //     authors = authors.concat({
      //       name: args.author,
      //       id: uuid(),
      //     });
      //   }

      //   const book = { ...args, id: uuid() };
      //   books = books.concat(book);
      //   return book;
      // },
      // editAuthor: (root, args) => {
      //   const author = authors.find((a) => a.name === args.name);
      //   if (!author) {
      //     return null;
      //   }

      //   const updatedAuthor = { ...author, born: args.setBornTo };
      //   authors = authors.map((a) => (a.name === args.name ? updatedAuthor : a));
      //   return updatedAuthor;
    },

    //edite author
    editAuthor: async (root, args, context) => {
      //PROTECT EDITAUTHOR
      const currentUser = context.currentUser;

      if (!currentUser) {
        throw new GraphQLError("Not authenticated", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      try {
        const author = await Author.findOne({
          name: args.name,
        });

        if (!author) {
          return null;
        }

        author.born = args.setBornTo;

        await author.save();

        return author;
      } catch (error) {
        throw new GraphQLError(error.message, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args,
            error,
          },
        });
      }
    },

    //create user
    createUser: async (root, args) => {
      const user = new User({
        username: args.username,
        favoriteGenre: args.favoriteGenre,
      });

      return user.save().catch((error) => {
        throw new GraphQLError(`Creating the user failed: ${error.message}`, {
          extensions: {
            code: "BAD_USER_INPUT",
            invalidArgs: args.username,
            error,
          },
        });
      });
    },

    //login user
    login: async (root, args) => {
      const user = await User.findOne({ username: args.username });

      if (!user || args.password !== "secret") {
        throw new GraphQLError("wrong credentials", {
          extensions: {
            code: "BAD_USER_INPUT",
          },
        });
      }

      const userForToken = {
        username: user.username,
        id: user._id,
      };

      return { value: jwt.sign(userForToken, JWT_SECRET) };
    },

    //reset database
    _resetDatabase: async () => {
      if (process.env.NODE_ENV !== "test") {
        throw new GraphQLError("_resetDatabase is only available in test mode");
      }

      await Author.deleteMany({});
      await Book.deleteMany({});
      await User.deleteMany({});

      return true;
    },
  },
};

module.exports = resolvers;
