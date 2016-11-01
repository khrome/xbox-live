###Overwatch

Grab all the public stats for a handle:

	api.query(<xbox-live username>, function(err, data){
		//data['all-heroes'] contains the global summary stats
		//data['dva'] shows the players stats while playing D.Va
	})

which returns summaries for each character as well as a global summary.
