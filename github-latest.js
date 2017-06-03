#! /usr/bin/env node

let rest = require('./lib/get-json');
let parser = require('./lib/parser-json');
let pjson = require('./package.json');
let program = require('commander');


program.version(pjson.version)
	.option('-o, --owner <owner>', 'Owner of repository [Mandatory]')
	.option('-r, --repository <repository>', 'Name of repository [Mandatory]')
	.option('-d, --download <suffix>', 'Suffix of download url. Example: "x64.tar.gz"')
	.option('-t, --tag', 'Show up tag')
	.option('-n, --notes', 'Show up body of release')


program.on('--help', function() {
	console.log('  Examples:');
	console.log('');
	console.log('    $ github-latest -o welbert -r github-latest');
	console.log('    $ github-latest -o welbert -r github-latest -n');
	console.log('    $ github-latest -o welbert -r github-latest -s ".zip"');
	console.log('');
});

program.parse(process.argv);

if(!program.owner && !program.repository){
	console.log("You need to specify an owner and a repository.")
	process.exit();
}

rest.defineOptions({path: '/repos/'+ program.owner +'/'+program.repository+'/releases/latest'})

rest.getJSON((status,response)=>{
  if(status==200){
    parser.defineOptions({
    	project: program.repository,
    	tag: program.tag,
    	download: program.download,
    	notes: program.notes
    });

    var result = parser.parse(response);

    console.log(result);

  }else{
    console.log("Fail. Status: "+ status + "; Error: " + response.message);
  }
});