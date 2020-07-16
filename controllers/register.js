

const handleRegister = (req, res, db, bcrypt)=>{
	const {email, name, password} = req.body;
	if (!email || !name || !password){
		return res.status(400).json('incorrect form submission');
	}
	const hash = bcrypt.hashSync(password);

	db.transaction(trx => {
		 return trx.insert({
			hash: hash,
			email: email
		}, 'email')
		.into('login')
		.then(loginEmail => {
				return trx.insert({
				email: loginEmail[0],
				name: name,
				joined: new Date()
				}, '*')
				.into('users')
				.then(user => {
					res.json(user[0]);
				})
			})
		.then(trx.commit)
		.catch(trx.rollback)
		})
		.catch(err => res.status(400).json('unable to register'))
		}

module.exports = {
	handleRegister: handleRegister
};