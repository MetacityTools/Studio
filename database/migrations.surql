DEFINE SCOPE allusers
SESSION 12h 

SIGNUP (
    CREATE type::thing('user', string::lowercase(string::trim($user))) 
    SET pass = crypto::argon2::generate($pass)
)
SIGNIN (
    SELECT * FROM type::thing('user', string::lowercase(string::trim($user))) 
    WHERE crypto::argon2::compare(pass, $pass)
);

