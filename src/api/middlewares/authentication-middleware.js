// intinya ini file buat bkin jwt jwt itu

const passport = require('passport'); // module utk menghandle authentication di node.js
const passportJWT = require('passport-jwt'); // authenticating dgn jwt

const config = require('../../core/config'); // berisi configuration settings buat application + secret key JWT
const { User } = require('../../models'); // ambil dr user-schema utk manage data user

// Authenticate user based on the JWT token
passport.use(
  'user', // ini deklarasi nama, nnti dipake di routes/ middleware
  new passportJWT.Strategy(
    // options
    {
      // jwtFromRequest : fungsi utk memberitahu passport untuk menemukan jwt
      // selanjutnya dispecify kalau jwt ada di authorization header dan schemenya jadi 'jwt'
      jwtFromRequest: passportJWT.ExtractJwt.fromAuthHeaderWithScheme('jwt'),
      secretOrKey: config.secret.jwt, // diperlukan buat verify token
    },
    // verify
    async (payload, done) => {
      const user = await User.findOne({ id: payload.user_id }); // ini buat find user di database (di sini nemuin id),
      return user ? done(null, user) : done(null, false); // kalau ada return user, kalau gaada return false
    }
  )
);

// 'user' nya dari yang tadi udah dideklarasi
// intinya diexport
module.exports = passport.authenticate('user', { session: false }); // ga gt paham ,tp katanya yg session: false buat mengidentifikasikan bahwa session support tidak digunakan utk authentication
