// Utility Functions

function read4ByteCharacters(location,WAD)
{
	var output = WAD.file.slice(location, location+4);

	return output;
}

function read8ByteCharacters(location,WAD)
{
	var output = WAD.file.slice(location, location+8);

	return output;
}

function read8ByteCharactersFromContent(i,location,WAD)
{
	var output = WAD.lumps[i].content.slice(location, location+8);
	return output;
}

function read4ByteNumber(location,WAD)
{
	var output = WAD.file.charCodeAt(location)*(1) + WAD.file.charCodeAt(location+1)*(256) + WAD.file.charCodeAt(location+2)*(256*256) + WAD.file.charCodeAt(location+3)*(256*256*256);
	return output;
	
}

function read1ByteNumberFromContent(i, location,WAD)
{
	return WAD.lumps[i].content.charCodeAt(location);
}



function read2ByteSignedNumberFromContent(i, location,WAD)
{
	var number = WAD.lumps[i].content.charCodeAt(location) + WAD.lumps[i].content.charCodeAt(location + 1)*(256);
	
	
	if (number > 32767)
		{
		number = number - 65536;
		}
		
	return number;
}


function read2ByteNumberFromContent(i, location,WAD)
{
	return WAD.lumps[i].content.charCodeAt(location) + WAD.lumps[i].content.charCodeAt(location + 1)*(256);
}

function read4ByteNumberFromContent(i, location,WAD)
{
	return WAD.lumps[i].content.charCodeAt(location) + WAD.lumps[i].content.charCodeAt(location + 1)*(256) + WAD.lumps[i].content.charCodeAt(location + 2)*(256*256) + WAD.lumps[i].content.charCodeAt(location + 3)*(256*256*256);
}
/*
function setPixel(x, y, r, g, b, a) {
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}
*/