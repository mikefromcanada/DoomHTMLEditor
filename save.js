//Writing WADs back to file
var header = "";
var directory = "";

function saveWAD(){
//going to have to do the header last for the final version
  header = PWAD.header.identification+PWAD.header.numlumps+PWAD.header.infotableofs;
  console.log(header);

//directory    
  for (var i=0; i<PWAD.header.numlumps; i++)
	{
		directory+=PWAD.lumps[i].filepos;
		directory+=PWAD.lumps[i].size;
		directory+=PWAD.lumps[i].name;
		//content is stored as a blob at first
		//directory+=PWAD.lumps[i].content;
	}
 
  console.log(directory);

}