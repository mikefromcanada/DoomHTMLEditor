// Doom.js - Used to load a DOOM PWAD
// sample PWAD here: http://www.dosgamers.com/dos/dos-games/doom-heretic-hexen

var PWAD = new Object();
//PWAD.file = "";
////var PWAD.fileLoc = 0;
//PWAD.header = new Object();
//PWAD.lumps = new Array();
//PWAD.palette = new Array();
var imageData;
//PWAD.textures = new Array();
//PWAD.pnames = new Array();
//PWAD.patches = new Array();
//PWAD.maps = new Array();



//This is for PWADs only for now
function LoadPWADHeader()
{
	console.log('Loading PWAD header:');
	PWAD.header.identification = read4ByteCharacters(0,PWAD);
	PWAD.header.numlumps = read4ByteNumber(4,PWAD);
	PWAD.header.infotableofs = read4ByteNumber(8,PWAD);
	console.log(PWAD.header.identification);
	console.log(PWAD.header.numlumps);
	console.log('Header complete');
}

function LoadPWADDirectory()
{
	console.log('Loading PWAD Lump Directory');
	var directory = PWAD.header.infotableofs;

	for (var i=0; i<PWAD.header.numlumps; i++)
	{
		PWAD.lumps[i] = new Object();
		PWAD.lumps[i].filepos = read4ByteNumber(directory,PWAD);
		PWAD.lumps[i].size = read4ByteNumber(directory+4,PWAD);
		PWAD.lumps[i].name = read8ByteCharacters(directory+8,PWAD);
		PWAD.lumps[i].content = PWAD.file.slice(PWAD.lumps[i].filepos , PWAD.lumps[i].filepos + PWAD.lumps[i].size);
		directory = directory + 16;
		
		//console.log(PWAD.lumps[i].filepos,PWAD.lumps[i].size,PWAD.lumps[i].name);
		console.log(window.atob(PWAD.lumps[i].content));
	}
	console.log('Lump Directory Complete');
}

function parsePWAD()
{
	console.log('load default palette');
	storeDefaultPalette();
	
	console.log('Parsing PWAD lumps:');

	var flats = false;
	var patches = false;
	var sprites = false;
	var map = false;
	
	for (var i=0; i<PWAD.header.numlumps; i++)
	{
	//Populate Debugging list
	console.log('LUMP: '+i+' '+PWAD.lumps[i].name);
	addToDebug(i);
	
		if (flats == true)
		{
		// we're parsing flats, if its the end flag, stop parsing flats
	
		if ((PWAD.lumps[i].name.slice(0,2) == 'F1')||(PWAD.lumps[i].name.slice(0,2) == 'F2'))
		{
		// ignore the F1_START F2_END etc
		
		}
		else if (PWAD.lumps[i].name == 'F_END\0\0\0')
		{
			flats = false;	
		}
		
		else if (PWAD.lumps[i].name == 'FF_END\0\0')
		{
			flats = false;	
		}
				
		else
		{
			addOptionToFlatSelector(i);
		}
	}
	else if (patches == true)
	{
	// we're parsing patches
	
		if (PWAD.lumps[i].name == 'P_END\0\0\0' || PWAD.lumps[i].name == 'PP_END\0\0')
		{
			patches = false;	
		}
		
		else
		{
			// now process the patch
	
			//ignore P1_START, P1_END, P2_START, P2_END
			
			// add all else
			addToPatchLibrary(i);
		}
	}
	
	else if (sprites == true)
	{
	// we're parsing sprites
	if (PWAD.lumps[i].name == 'S_END\0\0\0' || PWAD.lumps[i].name == 'SS_END\0\0')
		{
			sprites = false;	
		}
		
		else
		{
			// now process the patch
	
			//ignore P1_START, P1_END, P2_START, P2_END
			
			// add all else
			addOptionToImageSelector(i, 'enemyImageSelector');
		}
	
	}
	else
	{
	//console.log(PWAD.lumps[i].name);
	switch (PWAD.lumps[i].name)
	{
	case "PLAYPAL\0":
	// player palette
	parseGamePalette(i);
	break;
	
	case "COLORMAP":
	// color maps
	break;
	
	
	// text
	case "ENDOOM\0\0":
	case "ENDTEXT\0": //heretic
	
	// end text
	document.getElementById('endoom').innerHTML = parseEnDoom(i);
	break;
	//fullscreen images
	case "CREDIT\0\0":
	case "HELP1\0\0\0":
	case "HELP2\0\0\0":
	case "TITLEPIC":
	case "VICTORY2":
	case "PFUB1\0\0\0":
	case "PFUB2\0\0\0":
	case "AUTOPAGE":	
	case "ENDPIC\0\0":
	case "INTERPIC":
	case "BOSSBACK":
	case "HELP\0\0\0\0":
	addOptionToImageSelector(i, 'miscImageSelector');
	break;
	
	case "END0\0\0\0\0":
	case "END1\0\0\0\0":
	case "END2\0\0\0\0":
	case "END3\0\0\0\0":
	case "END4\0\0\0\0":
	case "END5\0\0\0\0":
	case "END6\0\0\0\0":
	
	case "AMMNUM0\0":
	case "AMMNUM1\0":
	case "AMMNUM2\0":
	case "AMMNUM3\0":
	case "AMMNUM4\0":
	case "AMMNUM5\0":
	case "AMMNUM6\0":
	case "AMMNUM7\0":
	case "AMMNUM8\0":
	case "AMMNUM9\0":
	
	
	
	case "STBAR\0\0\0":
	case "STCHAT\0\0":
	
	case "STWEAP0\0":
	case "STWEAP1\0":
	case "STWEAP2\0":
	case "STWEAP3\0":
	case "STWEAP4\0":
	case "STWEAP5\0":
		
	case "STGNUM0\0":
	case "STGNUM1\0":
	case "STGNUM2\0":
	case "STGNUM3\0":
	case "STGNUM4\0":
	case "STGNUM5\0":
	case "STGNUM6\0":
	case "STGNUM7\0":
	case "STGNUM8\0":
	case "STGNUM9\0":
	
	case "STTNUM0\0":
	case "STTNUM1\0":
	case "STTNUM2\0":
	case "STTNUM3\0":
	case "STTNUM4\0":
	case "STTNUM5\0":
	case "STTNUM6\0":
	case "STTNUM7\0":
	case "STTNUM8\0":
	case "STTNUM9\0":
	
	
	case "STYSNUM0":
	case "STYSNUM1":
	case "STYSNUM2":
	case "STYSNUM3":
	case "STYSNUM4":
	case "STYSNUM5":
	case "STYSNUM6":
	case "STYSNUM7":
	case "STYSNUM8":
	case "STYSNUM9":
	
	
	case "STTMINUS":
	case "STTPRCNT":
	case "STKEYS0\0":
	case "STKEYS1\0":
	case "STKEYS2\0":
	case "STKEYS3\0":
	case "STKEYS4\0":
	case "STKEYS5\0":

	case "STCFN033":
	case "STCFN034":
	case "STCFN035":
	case "STCFN036":
	case "STCFN037":
	case "STCFN038":
	case "STCFN039":
	case "STCFN040":
	case "STCFN041":
	case "STCFN042":
	case "STCFN043":
	case "STCFN044":
	case "STCFN045":
	case "STCFN046":
	case "STCFN047":
	case "STCFN048":
	case "STCFN049":
	case "STCFN050":
	case "STCFN051":
	case "STCFN052":
	case "STCFN053":
	case "STCFN054":
	case "STCFN055":
	case "STCFN056":
	case "STCFN057":
	case "STCFN058":
	case "STCFN059":
	case "STCFN060":
	case "STCFN061":
	case "STCFN062":
	case "STCFN063":
	case "STCFN064":
	case "STCFN065":
	case "STCFN066":
	case "STCFN067":
	case "STCFN068":
	case "STCFN069":
	case "STCFN070":
	case "STCFN071":
	case "STCFN072":
	case "STCFN073":
	case "STCFN074":
	case "STCFN075":
	case "STCFN076":
	case "STCFN077":
	case "STCFN078":
	case "STCFN079":
	case "STCFN080":
	case "STCFN081":
	case "STCFN082":
	case "STCFN083":
	case "STCFN084":
	case "STCFN085":
	case "STCFN086":
	case "STCFN087":
	case "STCFN088":
	case "STCFN089":
	case "STCFN090":
	case "STCFN091":
	case "STCFN092":
	case "STCFN093":
	case "STCFN094":
	case "STCFN095":
	case "STCFN121":
	
	case "STPB0\0\0\0":
	case "STPB1\0\0\0":
	case "STPB2\0\0\0":
	case "STPB3\0\0\0":
	
	
	case "STDISK\0\0":
	case "STCDROM\0":
	case "STARMS\0\0":
	
	
	//Heretic
	case "FACEA0\0\0":
	case "FACEA1\0\0":
	case "FACEA2\0\0":
	case "FACEA3\0\0":
	case "FACEB0\0\0":
	case "FACEB1\0\0":
	case "FACEB2\0\0":
	case "FACEB3\0\0":
	
	
	addOptionToImageSelector(i, 'uiImageSelector');
	break;
	 
	 case "S_START\0":
	 sprites = true;
	 break;
	 
	 case "SS_START":
	 sprites = true;
	 break;
	
		//heretic images
	case "TITLE\0\0\0":
	case "LOADING\0":
	case "ORDER\0\0\0":
	
	break;
	
	
	case "TEXTURE1":
	case "TEXTURE2":
	// texture directories
	parseTextureDirectory(i);
	break;
	
	//flats - floor/ceiling textures
	case "F_START\0":
	//start flats
	flats = true;
	break;
	
	case "FF_START":
	//start flats
	flats = true;
	break;
	
	
	case "P_START\0":
	patches = true;
	break;
	
	case "PP_START":
	patches = true;
	break;
	
	
	case "PNAMES\0\0":
	parsePNAMES(i);
	break;
	
	case "F_END\0\0\0":
	break;
	
	case "FF_END\0\0":
	break;
	
	
	//demos
	case "DEMO1\0\0\0":
	case "DEMO2\0\0\0":
	case "DEMO3\0\0\0":
	case "DEMO4\0\0\0":
	case "DEMO5\0\0\0":
	
	break; 
	
	
	// level data
	
	case "E1M1\0\0\0\0":
	case "E1M2\0\0\0\0":
	case "E1M3\0\0\0\0":
	case "E1M4\0\0\0\0":
	case "E1M5\0\0\0\0":
	case "E1M6\0\0\0\0":
	case "E1M7\0\0\0\0":
	case "E1M8\0\0\0\0":
	case "E1M9\0\0\0\0":
	case "E2M1\0\0\0\0":
	case "E2M2\0\0\0\0":
	case "E2M3\0\0\0\0":
	case "E2M4\0\0\0\0":
	case "E2M5\0\0\0\0":
	case "E2M6\0\0\0\0":
	case "E2M7\0\0\0\0":
	case "E2M8\0\0\0\0":
	case "E2M9\0\0\0\0":
	case "E3M1\0\0\0\0":
	case "E3M2\0\0\0\0":
	case "E3M3\0\0\0\0":
	case "E3M4\0\0\0\0":
	case "E3M5\0\0\0\0":
	case "E3M6\0\0\0\0":
	case "E3M7\0\0\0\0":
	case "E3M8\0\0\0\0":
	case "E3M9\0\0\0\0":
	case "E4M1\0\0\0\0":
	case "E4M2\0\0\0\0":
	case "E4M3\0\0\0\0":
	case "E4M4\0\0\0\0":
	case "E4M5\0\0\0\0":
	case "E4M6\0\0\0\0":
	case "E4M7\0\0\0\0":
	case "E4M8\0\0\0\0":
	case "E4M9\0\0\0\0":
	case "MAP01\0\0\0":
	case "MAP02\0\0\0":
	case "MAP03\0\0\0":
	case "MAP04\0\0\0":
	case "MAP05\0\0\0":
	case "MAP06\0\0\0":
	case "MAP07\0\0\0":
	case "MAP08\0\0\0":
	case "MAP09\0\0\0":
	case "MAP10\0\0\0":
	case "MAP11\0\0\0":
	case "MAP12\0\0\0":
	case "MAP13\0\0\0":
	case "MAP14\0\0\0":
	case "MAP15\0\0\0":
	case "MAP16\0\0\0":
	case "MAP17\0\0\0":
	case "MAP18\0\0\0":
	case "MAP19\0\0\0":
	case "MAP20\0\0\0":
	case "MAP21\0\0\0":
	case "MAP22\0\0\0":
	case "MAP23\0\0\0":
	case "MAP24\0\0\0":
	case "MAP25\0\0\0":
	case "MAP26\0\0\0":
	case "MAP27\0\0\0":
	case "MAP28\0\0\0":
	case "MAP29\0\0\0":
	case "MAP30\0\0\0":
	case "MAP31\0\0\0":
	case "MAP32\0\0\0":
	//console.log(i);
	addMap(i);
	
	
	break;
	case "THINGS\0\0":
	//things
		parseThings(i);
	break;
	
	case "LINEDEFS":
		parseLineDefs(i);
	break;
	
	case "SIDEDEFS":
		parseSideDefs(i);
	break;
	
	case "VERTEXES":
		parseVertices(i);
	break;
	
	case "SEGS\0\0\0\0":
	break;
	
	case "SSECTORS":
	break;
	
	case "NODES\0\0\0":
	break;
	
	case "SECTORS\0":
		parseSectors(i);
	break;
	
	case "REJECT\0\0":
	break;
	
	case "BLOCKMAP":
	break;
	
	case "BEHAVIOR":
	break;
	
	//sound data
	case "GENMIDI\0":
	break;
	
	case "DMXGUS\0\0":
	break;
	
	//heretic sfx - can't auto-load these like doom
	case "CHAT\0\0\0\0":
	case "ARTIUSE\0":
	case "GFRAG\0\0\0":
	case "GLDHIT\0\0":
	case "GNTFUL\0\0":
	case "GNTHIT\0\0":
	case "GNTPOW\0\0":
	case "GNTACT\0\0":
	case "GNTUSE\0\0":
	case "BOWSHT\0\0":
	case "HRNHIT\0\0":
	case "STFHIT\0\0":
	case "STFPOW\0\0":
	case "STFCRK\0\0":
	case "BLSSHT\0\0":
	case "BLSHIT\0\0":
	case "PHOHIT\0\0":
	case "IMPSIT\0\0":
	case "IMPAT1\0\0":
	case "IMPAT2\0\0":
	case "IMPDTH\0\0":
	case "IMPPAI\0\0":
	case "MUMSIT\0\0":
	case "MUMAT1\0\0":
	case "MUMAT2\0\0":
	case "MUMDTH\0\0":
	case "MUMPAI\0\0":
	case "KGTSIT\0\0":
	case "KGTATK\0\0":
	case "KGTAT2\0\0":
	case "KGTDTH\0\0":
	case "KGTPAI\0\0":
	case "WIZSIT\0\0":
	case "WIZATK\0\0":
	case "WIZDTH\0\0":
	case "WIZACT\0\0":
	case "WIZPAI\0\0":
	case "HEDSIT\0\0":
	case "HEDAT1\0\0":
	case "HEDAT2\0\0":
	case "HEDAT3\0\0":
	case "HEDDTH\0\0":
	case "HEDACT\0\0":
	case "HEDPAI\0\0":
	case "PLROOF\0\0":
	case "PLRPAI\0\0":
	case "PLRDTH\0\0":
	case "PLRWDTH\0":
	case "PLRCDTH\0":
	case "GIBDTH\0\0":
	case "ITEMUP\0\0":
	case "WPNUP\0\0\0":
	case "ARTIUP\0\0":
	case "KEYUP\0\0\0":
	case "TELEPT\0\0":
	case "DOROPN\0\0":
	case "DORCLS\0\0":
	case "DORMOV\0\0":
	case "SWITCH\0\0":
	case "PSTART\0\0":
	case "PSTOP\0\0\0":
	case "STNMOV\0\0":
	case "WIND\0\0\0\0":
	case "CHICPAI\0":
	case "CHICATK\0":
	case "CHICDTH\0":
	case "CHICACT\0":
	case "CHICPK1\0":
	case "CHICPK2\0":
	case "CHICPK3\0":
	case "RIPSLOP\0":
	case "NEWPOD\0\0":
	case "PODEXP\0\0":
	case "BURN\0\0\0\0":
	case "GLOOP\0\0\0":
	case "MUMHED\0\0":
	case "RESPAWN\0":
	case "AMB3\0\0\0\0":
	case "AMB4\0\0\0\0":
	case "AMB5\0\0\0\0":
	case "AMB6\0\0\0\0":
	case "AMB7\0\0\0\0":
	case "AMB9\0\0\0\0":
	case "AMB10\0\0\0":
	case "AMB11\0\0\0":
	
	addOptionToSFXSelector(i);
	break;
	
	//DoomED tag, discard
	case "TAGDESC\0":
	break;
	
	default:
	
	if (PWAD.lumps[i].name.slice(0,2) == "D_")
	{ // MUSIC
	
		break;
	
	}
	
	if (PWAD.lumps[i].name.slice(0,4) == "MUS_")
	{ // MUSIC
	
		break;
	
	}
	
	
	
	if (PWAD.lumps[i].name.slice(0,2) == "DS")
	{ // sfx
	addOptionToSFXSelector(i);
	break;
	
	}
	
	if (PWAD.lumps[i].name.slice(0,2) == "DP")
	{ // sfx
	break;
	
	}
	
	if (PWAD.lumps[i].name.slice(0,3) == "STF")
	{ // UI
	
	addOptionToImageSelector(i, 'uiImageSelector');
	
	break;
	
	}
	
		if (PWAD.lumps[i].name.slice(0,2) == "WI")
	{ // UI
	
	addOptionToImageSelector(i, 'uiImageSelector');
	
	break;
	
	}

	if (PWAD.lumps[i].name.slice(0,4) == "FONT")
	{ // Heretic UI
	
	addOptionToImageSelector(i, 'uiImageSelector');
	
	break;
	
	}
	
	
			if (PWAD.lumps[i].name.slice(0,4) == "BRDR")
	{ // UI
	
	addOptionToImageSelector(i, 'uiImageSelector');
	
	break;
	
	}
	
	
		if (PWAD.lumps[i].name.slice(0,2) == "M_")
	{ // UI
	
	addOptionToImageSelector(i, 'uiImageSelector');
	
	break;
	
	}
	
	
	
	console.log('Unknown Lump: '+PWAD.lumps[i].name+' at '+i);
	addOptionToImageSelector(i, 'uiImageSelector');
	break;
	
	
			}
		}
	}
}

function addToDebug(i)
{
	var selector = document.getElementById('debugSelector');
	var option = document.createElement('option');
	var name = document.createTextNode(i+' '+PWAD.lumps[i].name);
	
	option.setAttribute('value', i);
	option.appendChild(name);
	selector.appendChild(option);
}

function addToDebugPnames(i)
{
	var selector = document.getElementById('debugPnames');
	var option = document.createElement('option');
	var name = document.createTextNode(i+' '+PWAD.pnames[i].name);
	
	option.setAttribute('value', i);
	option.appendChild(name);
	selector.appendChild(option);



}


function addOptionToSFXSelector(i)
{
	
	var selector = document.getElementById('sfxSelector');
	var option = document.createElement('option');
	var name = document.createTextNode(PWAD.lumps[i].name);
	
	option.setAttribute('value', i);
	option.appendChild(name);
	selector.appendChild(option);
	
}

function changeSFX(evt)
{
//console.log(evt);
	parseSFX(evt.target.value, true);
}


function parseSFX(i, autoPlay)
{
	var sfxOffset = 0;
	
	var start = read2ByteNumberFromContent(i, sfxOffset,PWAD);
	sfxOffset = sfxOffset + 2;
	
	var sampleRate = read2ByteNumberFromContent(i, sfxOffset,PWAD);
	sfxOffset = sfxOffset + 2;
	
	var samples = read2ByteNumberFromContent(i, sfxOffset,PWAD);
	sfxOffset = sfxOffset + 2;
	
	var end = read2ByteNumberFromContent(i, sfxOffset,PWAD);
	sfxOffset = sfxOffset + 2;
	
	console.log(start+' '+sampleRate+' '+samples+' '+end);
	
	PWAD.buffer = PWAD.context.createBuffer(1, samples*2, sampleRate*2);
	
	
	var buf = PWAD.buffer.getChannelData(0);
	
	for (var j=0; j<samples*2; j = j+2)
	{
		var sample = read1ByteNumberFromContent(i, sfxOffset,PWAD);
		buf[j] = sample/255;
		buf[j+1] = sample/255;	
		sfxOffset++;
		
	}
	
	if (autoPlay)
	{
		playSFX();
	}
}

function playSFX()
{
	//console.log('playing current effect');
	
	PWAD.source = PWAD.context.createBufferSource(0);
	PWAD.source.buffer = PWAD.buffer;
	PWAD.source.connect(PWAD.context.destination);
	//PWAD.source.noteOn( PWAD.context.currentTime);
	PWAD.source.noteOn(0);
	
}



function addMap(i)
{
	var map_num = PWAD.maps.length;
	PWAD.maps[map_num] = new Object();
	
	
	var selector = document.getElementById('mapSelector');
	var option = document.createElement('option');
	var name = document.createTextNode(PWAD.lumps[i].name);
	
	option.setAttribute('value', map_num);
	option.appendChild(name);
	selector.appendChild(option);


	
}

function parseThings(i)
{
	var currentMap = PWAD.maps.length - 1;
	
	PWAD.maps[currentMap].things = new Array();
	
	var thingCount = PWAD.lumps[i].content.length / 10;

	console.log('Parse Things for map: '+currentMap+' Thingcount: '+thingCount);
	var thingOffset =0;

	for (var j=0; j<thingCount; j++)
	{
		
		PWAD.maps[currentMap].things[j] = new Object();
		PWAD.maps[currentMap].things[j].xPos = read2ByteSignedNumberFromContent(i, thingOffset,PWAD);
		thingOffset = thingOffset + 2;
	
		PWAD.maps[currentMap].things[j].yPos = read2ByteSignedNumberFromContent(i, thingOffset,PWAD);
		thingOffset = thingOffset + 2;

		PWAD.maps[currentMap].things[j].angle = read2ByteNumberFromContent(i, thingOffset,PWAD);
		thingOffset = thingOffset + 2;
		
		PWAD.maps[currentMap].things[j].type = read2ByteNumberFromContent(i, thingOffset,PWAD);
		thingOffset = thingOffset + 2;
		
		PWAD.maps[currentMap].things[j].options = read2ByteNumberFromContent(i, thingOffset,PWAD);
		thingOffset = thingOffset + 2;
		
	}

}


function parseVertices(i)
{

	

	var currentMap = PWAD.maps.length - 1;
	PWAD.maps[currentMap].vertices = new Array();
	var vertexCount = PWAD.lumps[i].content.length / 4;
	var vertexOffset =0;

	console.log('Parse Vertices for map: '+currentMap+' Vertex Count: '+vertexCount+' Lump: '+i);
	



	for (var j=0; j<vertexCount; j++)
	{
		PWAD.maps[currentMap].vertices[j] = new Object();
	
		PWAD.maps[currentMap].vertices[j].xPos = read2ByteSignedNumberFromContent(i, vertexOffset,PWAD);
		
		
		vertexOffset = vertexOffset + 2;
	
		PWAD.maps[currentMap].vertices[j].yPos = read2ByteSignedNumberFromContent(i, vertexOffset,PWAD);
		
		
		vertexOffset = vertexOffset + 2;
		
		
		if (j==0)
		{
		PWAD.maps[currentMap].minX = 	PWAD.maps[currentMap].vertices[j].xPos;
		PWAD.maps[currentMap].maxX = 	PWAD.maps[currentMap].vertices[j].xPos;
		
		PWAD.maps[currentMap].minY = 	PWAD.maps[currentMap].vertices[j].yPos;
		PWAD.maps[currentMap].maxY = 	PWAD.maps[currentMap].vertices[j].yPos;
		
		
		}
		else
		{
			if (PWAD.maps[currentMap].vertices[j].xPos > PWAD.maps[currentMap].maxX)
			{
				PWAD.maps[currentMap].maxX = PWAD.maps[currentMap].vertices[j].xPos;
		
			}
			
			if (PWAD.maps[currentMap].vertices[j].xPos < PWAD.maps[currentMap].minX)
			{
				PWAD.maps[currentMap].minX = PWAD.maps[currentMap].vertices[j].xPos;
		
			}
			if (PWAD.maps[currentMap].vertices[j].yPos > PWAD.maps[currentMap].maxY)
			{
				PWAD.maps[currentMap].maxY = PWAD.maps[currentMap].vertices[j].yPos;
		
			}
			
			if (PWAD.maps[currentMap].vertices[j].yPos < PWAD.maps[currentMap].minY)
			{
				PWAD.maps[currentMap].minY= PWAD.maps[currentMap].vertices[j].yPos;
		
			}			
			
		}
		
	}
}

function parseSectors(i)
{
	var currentMap = PWAD.maps.length - 1;
	PWAD.maps[currentMap].sectors = new Array();	
	var sectorCount = PWAD.lumps[i].content.length / 26;
	
	console.log('Parse sectors for map: '+currentMap+' Sector: '+sectorCount);
	
	var sectorOffset = 0;
	
	for (var j=0; j<sectorCount; j++)
	{
		PWAD.maps[currentMap].sectors[j] = new Object();
		PWAD.maps[currentMap].sectors[j].floorHeight = read2ByteSignedNumberFromContent(i, sectorOffset,PWAD);
		sectorOffset = sectorOffset + 2;
		
		PWAD.maps[currentMap].sectors[j].ceilingHeight = read2ByteSignedNumberFromContent(i, sectorOffset,PWAD);
		sectorOffset = sectorOffset + 2;
		
		PWAD.maps[currentMap].sidedefs[j].ceilingFlat = read8ByteCharactersFromContent(i,sectorOffset,PWAD);
		sectorOffset = sectorOffset + 8;
		
		PWAD.maps[currentMap].sidedefs[j].floorFlat = read8ByteCharactersFromContent(i,sectorOffset,PWAD);
		sectorOffset = sectorOffset + 8;		
	
		PWAD.maps[currentMap].sectors[j].lightLevel = read2ByteNumberFromContent(i, sectorOffset,PWAD);
		sectorOffset = sectorOffset + 2;	
		
		PWAD.maps[currentMap].sectors[j].specialSector = read2ByteNumberFromContent(i, sectorOffset,PWAD);
		sectorOffset = sectorOffset + 2;	
		
		PWAD.maps[currentMap].sectors[j].tagNumber = read2ByteNumberFromContent(i, sectorOffset,PWAD);
		sectorOffset = sectorOffset + 2;	
		
	}

}

function parseSideDefs(i)
{
	var currentMap = PWAD.maps.length - 1;
	
	PWAD.maps[currentMap].sidedefs = new Array();
	
	var sideCount = PWAD.lumps[i].content.length / 30;
	
	console.log('Parse SideDefs for map: '+currentMap+' Sidecount: '+sideCount);
	
	var sideOffset = 0;
	
	for (var j=0; j<sideCount; j++)
	{
		PWAD.maps[currentMap].sidedefs[j] = new Object();
		
		PWAD.maps[currentMap].sidedefs[j].xOffset = read2ByteSignedNumberFromContent(i, sideOffset,PWAD);
		sideOffset = sideOffset + 2;
		
		PWAD.maps[currentMap].sidedefs[j].yOffset = read2ByteSignedNumberFromContent(i, sideOffset,PWAD);
		sideOffset = sideOffset + 2;
		
		PWAD.maps[currentMap].sidedefs[j].upperTexture = read8ByteCharactersFromContent(i,sideOffset,PWAD);
		sideOffset = sideOffset + 8;
		
		PWAD.maps[currentMap].sidedefs[j].lowerTexture = read8ByteCharactersFromContent(i,sideOffset,PWAD);
		sideOffset = sideOffset + 8;
		
		PWAD.maps[currentMap].sidedefs[j].middleTexture = read8ByteCharactersFromContent(i,sideOffset,PWAD);
		sideOffset = sideOffset + 8;
		
		
		PWAD.maps[currentMap].sidedefs[j].sector = read2ByteSignedNumberFromContent(i, sideOffset,PWAD);
		sideOffset = sideOffset + 2;
		
	}
	
	
}


function parseLineDefs(i)
{
	var currentMap = PWAD.maps.length - 1;
	
	PWAD.maps[currentMap].linedefs = new Array();
	
	var lineCount = PWAD.lumps[i].content.length / 14;

	console.log('Parse LineDefs for map: '+currentMap+' Linecount: '+lineCount);
	var lineOffset =0;

	for (var j=0; j<lineCount; j++)
	{
		
		PWAD.maps[currentMap].linedefs[j] = new Object();
		
		PWAD.maps[currentMap].linedefs[j].startVertex = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
		PWAD.maps[currentMap].linedefs[j].endVertex = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
		PWAD.maps[currentMap].linedefs[j].flags = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
		PWAD.maps[currentMap].linedefs[j].type = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
		PWAD.maps[currentMap].linedefs[j].trigger = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
		PWAD.maps[currentMap].linedefs[j].rightSideDef = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
		PWAD.maps[currentMap].linedefs[j].leftSideDef = read2ByteNumberFromContent(i, lineOffset,PWAD);
		lineOffset = lineOffset + 2;
		
	}


}


function changeMap(evt)
{
//console.log(evt);
	drawMap(evt.target.value);
}

function drawMap(i)
{
	var canvas = document.getElementById('mapViewer');

	canvas.width=PWAD.maps[i].maxX - PWAD.maps[i].minX;
	canvas.height=PWAD.maps[i].maxY - PWAD.maps[i].minY;
	
	
	//var mapDiv = 64;
	//canvas.width=1024;
	//canvas.height=1024;
	
	var ctx = canvas.getContext("2d");
	
	ctx.fillStyle = 'black';
	ctx.fillRect(0,0,canvas.width,canvas.height);
	
	
	var xOffset = 0 - PWAD.maps[i].minX;
	var yOffset = 0 - PWAD.maps[i].minY;
	
	
	//draw vertexes
	ctx.fillStyle = 'yellow';
	for (var j=0; j<PWAD.maps[i].vertices.length; j++)
	{
	
	 PWAD.maps[i].vertices[j].calcxPos = Math.floor(PWAD.maps[i].vertices[j].xPos + xOffset);
	PWAD.maps[i].vertices[j].calcyPos = Math.floor(PWAD.maps[i].vertices[j].yPos + yOffset);
	
	
	//flip the map
	PWAD.maps[i].vertices[j].calcyPos = canvas.height - PWAD.maps[i].vertices[j].calcyPos;
	
	ctx.fillRect(PWAD.maps[i].vertices[j].calcxPos-2, PWAD.maps[i].vertices[j].calcyPos-2, 5, 5);
	
	}
	
	//draw linedefs
	
	for (var j=0; j<PWAD.maps[i].linedefs.length; j++)
	{
		
		var start = PWAD.maps[i].linedefs[j].startVertex;
		var end = PWAD.maps[i].linedefs[j].endVertex;
		

		
	
		ctx.strokeStyle='red';
		
			//if two sided, draw in grey
		if ((PWAD.maps[i].linedefs[j].flags & 0x4) == 0x4)
		{
			ctx.strokeStyle='grey';
		}
		
		
		//if secret, draw in blue
		if ((PWAD.maps[i].linedefs[j].flags & 0x20) == 0x20)
		{
			ctx.strokeStyle='blue';
		}

		ctx.lineWidth=4;
		ctx.beginPath();
		ctx.moveTo( PWAD.maps[i].vertices[start].calcxPos, PWAD.maps[i].vertices[start].calcyPos);
		ctx.lineTo( PWAD.maps[i].vertices[end].calcxPos, PWAD.maps[i].vertices[end].calcyPos);
		ctx.stroke();
	
	}
	
	// draw the things
	
	for (var j=0; j<PWAD.maps[i].things.length; j++)
	{
	
	
		switch(PWAD.maps[i].things[j].type)
		{
		// player spawns
		case 1:
		case 2:
		case 3:
		case 4:
		case 11:
		case 14:
		ctx.fillStyle = 'white';
		break;
		
		
		//enemies
		case 3004:
		case 84:
		case 9:
		case 65:
		case 3001:
		case 3002:
		case 58:
		case 3006:
		case 3005:
		case 69:
		case 3003:
		case 68:
		case 71:
		case 66:
		case 67:
		case 64:
		case 7:
		case 16:
		case 88:
		case 89:
		case 87:
		ctx.fillStyle = 'purple';
		break;
		
		case 2005:
		case 2001:
		case 82:
		case 2002:
		case 2003:
		case 2004:
		case 2005:
		case 2006:
		ctx.fillStyle = 'blue';
		
		break;
		
		
		case 2007:
		case 2008:
		case 2010:
		case 2047:
		case 2048:
		case 2049:
		case 2046:
		case 17:
		case 8:
		ctx.fillStyle = 'red';
		break;
		
		
		case 2011:
		case 2012:
		case 2014:
		case 2015:
		case 2018:
		case 2019:
		case 83:
		case 2013:
		case 2022:
		case 2023:
		case 2024:
		case 2025:
		case 2026:
		case 2045:
		case 5:
		case 40:
		case 13:
		case 38:
		case 6:
		case 39:
		ctx.fillStyle = 'orange';
		break;
		
		
		default:
		ctx.fillStyle = 'green';
		break;
		
		}
		
		PWAD.maps[i].things[j].calcxPos = Math.floor(PWAD.maps[i].things[j].xPos + xOffset);
		PWAD.maps[i].things[j].calcyPos = Math.floor(PWAD.maps[i].things[j].yPos + yOffset);
	
	
		//flip the y pos
		PWAD.maps[i].things[j].calcyPos = canvas.height - PWAD.maps[i].things[j].calcyPos;
	
		ctx.fillRect(PWAD.maps[i].things[j].calcxPos-3, PWAD.maps[i].things[j].calcyPos-3, 7, 7);
	
	}
	
zoomMap();
}

function zoomMap()
{
	var canvas = document.getElementById('mapViewer');
	var ctx = canvas.getContext("2d");
	
	var intermediate = document.getElementById('intermediateMap');
	var ctx_i = intermediate.getContext("2d");
	

	
	intermediate.width = canvas.width /4;
	intermediate.height = canvas.height /4;
	ctx_i.drawImage(canvas, 0, 0, canvas.width /4, canvas.height /4);
	
	var finalImage = document.getElementById('finalMap');
	finalImage.width = intermediate.width;
	finalImage.height = intermediate.height;
	finalImage.src = intermediate.toDataURL('image/png');


}


function changeFlat(evt)
{
//console.log(evt);

parseFlat(evt.target.value);

}

function changeTexture(evt)
{
//console.log(evt);
	parseTexture(evt.target.value);
}


function parseFlat(i)
{
	var canvas = document.getElementById('flatViewer');
	var ctx = canvas.getContext("2d");

	//var flat_data = PWAD.lumps[i].content;
	var flat_offset = 0;
	
	canvas.width = 64;
	canvas.height = 64;
	
	
	
	if (document.getElementById('background').checked == true)
	{
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,64,64);
	}
	
	imageData = ctx.getImageData(0,0,64, 64);
	
	console.log('parsing flat '+i);
	
	for (var j=0; j<64; j++)
	{
		for (var k=0; k<64; k++)
		{
		var pal = read1ByteNumberFromContent(i, flat_offset,PWAD);
		//console.log(j+' '+k+' '+flat_offset+' '+pal);
		setPixel(k, canvas.width, j, canvas.height, PWAD.palette[pal].r, PWAD.palette[pal].g, PWAD.palette[pal].b, 255); 
		flat_offset++;
		
		
		}
	}
	
	ctx.putImageData(imageData, 0,0);

	tileFlat();
}

function tileFlat()
{
	var canvas = document.getElementById('flatViewer');
	var ctx = canvas.getContext("2d");
	
	var intermediate = document.getElementById('intermediateFlat');
	var ctx_i = intermediate.getContext("2d");
	
	var tiled = document.getElementById('finalFlats');
	
	
	intermediate.width = canvas.width * 4;
	intermediate.height = canvas.height * 4;
	
	
	for (var i=0; i<4; i++)
	{
		for (var j=0; j<4; j++)
		{
			ctx_i.drawImage(canvas, 0, 0, 64, 64, i*64, j*64, 64, 64);
		}
	}
	
	var finalFlat = document.getElementById('finalFlats');
	finalFlat.width = intermediate.width;
	finalFlat.height = intermediate.height;
	finalFlat.src = intermediate.toDataURL('image/png');
}


function addOptionToFlatSelector(i)
{
	var selector = document.getElementById('flatSelector');
	var option = document.createElement('option');
	var name = document.createTextNode(PWAD.lumps[i].name);
	
	//console.log('adding option '+i+' '+name);
	option.setAttribute('value', i);
	option.appendChild(name);
	selector.appendChild(option);
	
	
}



function addOptionToImageSelector(i, element)
{

	var selector = document.getElementById(element);
	var option = document.createElement('option');
	var name = document.createTextNode(PWAD.lumps[i].name);
	
	//console.log('adding option '+i+' '+name);
	option.setAttribute('value', i);
	option.appendChild(name);
	selector.appendChild(option);
}

function addOptionToTextureSelector(j)
{

	var selector = document.getElementById('textureSelector');
	var option = document.createElement('option');
	var name = document.createTextNode(PWAD.textures[j].name);
	
	//console.log('adding option '+i+' '+name);
	option.setAttribute('value', j);
	option.appendChild(name);
	selector.appendChild(option);
}



function changeImage(evt)
{
//console.log(evt);

parseImage(evt.target.value);

}

function parseImage(i)
{
	console.log('Loading Image: '+i);
	var canvas = document.getElementById('imageViewer');
	var ctx = canvas.getContext("2d");

	var image_data = PWAD.lumps[i].content;

	var header_width = read2ByteNumberFromContent(i, 0,PWAD);
	var header_height = read2ByteNumberFromContent(i,2,PWAD);
	var header_left_offset = read2ByteNumberFromContent(i,4,PWAD);
	var header_top_offset = read2ByteNumberFromContent(i,6,PWAD);

	canvas.width = header_width;
	canvas.height = header_height;
	
	var post_offset = 8;
	
	if (document.getElementById('background').checked == true)
	{
		ctx.fillStyle = 'black';
		ctx.fillRect(0,0,header_width,header_height);
	}
	
	imageData = ctx.getImageData(0,0,header_width, header_height);
	
	//create the columns array
	PWAD.lumps[i].columns = new Array();
	
	// for each column, save a record
	for (var j=0; j<header_width; j++)
	{
		PWAD.lumps[i].columns[j] = new Object();
		PWAD.lumps[i].columns[j].offset = read4ByteNumberFromContent(i, post_offset,PWAD);
		post_offset = post_offset + 4;
	
	}
	
	
	// For each column in the image
	for (var j=0; j<header_width; j++)
	{
	
	// start looking for posts
	
		var column_complete = false;
		var image_offset = PWAD.lumps[i].columns[j].offset;
	

		while(column_complete == false)
		{
		
			if (read1ByteNumberFromContent(i, image_offset,PWAD) == 255)
			{
			//empty column... move to next column
				column_complete = true;
			}
			else
			{
				var row_start = read1ByteNumberFromContent(i, image_offset,PWAD);
				var row_count = read1ByteNumberFromContent(i, image_offset + 1,PWAD);
		
				image_offset = image_offset + 3; // row_start + count + not_drawn
		
				// start drawing
			
				for (var k=row_start; k<(row_start + row_count); k++)
				{
		
					var pal = read1ByteNumberFromContent(i, image_offset,PWAD);
					//console.log(pal);
					setPixel(j, canvas.width, k, canvas.height, PWAD.palette[pal].r, PWAD.palette[pal].g, PWAD.palette[pal].b, 255); 
		
					image_offset++;
		

			
				}
			// increment past the last not drawn byte
			image_offset++;
			}
		}
	}

	ctx.putImageData(imageData, 0,0);

	zoomImage();
	
}

function zoomImage()
{
	var canvas = document.getElementById('imageViewer');
	var ctx = canvas.getContext("2d");
	
	var intermediate = document.getElementById('intermediate');
	var ctx_i = intermediate.getContext("2d");
	
	var zoom = document.getElementById('zoom');
	
	
	intermediate.width = canvas.width * zoom.value;
	intermediate.height = canvas.height * zoom.value;
	ctx_i.drawImage(canvas, 0, 0, canvas.width * zoom.value, canvas.height * zoom.value);
	
	var finalImage = document.getElementById('finalImage');
	finalImage.width = intermediate.width;
	finalImage.height = intermediate.height;
	finalImage.src = intermediate.toDataURL('image/png');
	


}

function parseGamePalette(i)
{
console.log("parsing palette");
var canvas = document.getElementById('playpal');
canvas.width = 256;
canvas.height = 256;

var ctx = canvas.getContext("2d");
ctx.clearRect(0, 0, canvas.width, canvas.height);

var palettes = PWAD.lumps[i].content;

var pal_i = 0;

for (var i=0; i<256; i++)
{
	ctx.fillStyle = 'rgb('+palettes.charCodeAt(pal_i)+','+palettes.charCodeAt(pal_i+1)+','+palettes.charCodeAt(pal_i + 2)+')';
	ctx.fillRect(Math.floor(i/16)*16,i%16*16, 16, 16);

	PWAD.palette[i] = new Object();
	PWAD.palette[i].r = palettes.charCodeAt(pal_i);
	PWAD.palette[i].g = palettes.charCodeAt(pal_i+1);
	PWAD.palette[i].b = palettes.charCodeAt(pal_i+2);
	
		pal_i = pal_i + 3;
}


}

function parseEnDoom(i)
{
	var source_text = "";
	var result_text = "";
	
	source_text = PWAD.lumps[i].content;

	for (var j=0; j<4000; j = j+2)
	{
	
	// forground color
	var f_color, b_color;
	
	switch (parseInt(source_text.charCodeAt(j+1)&0xF))
	{
	case 0:
	f_color = "#000000";
	break;
	case 1:
	f_color = "#0000AA";
	break;
	case 2:
	f_color = "#00AA00";
	break;
	case 3:
	f_color = "#00AAAA";
	break;
	case 4:
	f_color = "#AA0000";
	break;
	case 5:
	f_color = "#AA00AA";
	break;
	case 6:
	f_color = "#AA5500";
	break;
	case 7:
	f_color = "#AAAAAA";
	break;
	case 8:
	f_color = "#555555";
	break;
	case 9:
	f_color = "#5555FF";
	break;
	case 10:
	f_color = "#55FF55";
	break;
	case 11:
	f_color = "#55FFFF";
	break;
	case 12:
	f_color = "#FF5555";
	break;
	case 13:
	f_color = "#FF55FF";
	break;
	case 14:
	f_color = "#FFFF55";
	break;
	case 15:
	f_color = "#FFFFFF";
	break;
	}
	
	// background color
	switch ((source_text.charCodeAt(j+1)&0x70) >> 4)
	{
	case 0:
	b_color = "#000000";
	break;
	case 1:
	b_color = "#0000AA";
	break;
	case 2:
	b_color = "#00AA00";
	break;
	case 3:
	b_color = "#00AAAA";
	break;
	case 4:
	b_color = "#AA0000";
	break;
	case 5:
	b_color = "#AA00AA";
	break;
	case 6:
	b_color = "#AA5500";
	break;
	case 7:
	b_color = "#AAAAAA";
	break;
	case 8:
	b_color = "#555555";
	break;
	case 9:
	b_color = "#5555FF";
	break;
	case 10:
	b_color = "#55FF55";
	break;
	case 11:
	b_color = "#55FFFF";
	break;
	case 12:
	b_color = "#FF5555";
	break;
	case 13:
	b_color = "#FF55FF";
	break;
	case 14:
	b_color = "#FFFF55";
	break;
	case 15:
	b_color = "#FFFFFF";
	break;
	}	
	

	
		if (j%160 == 0)
	{
	result_text = result_text + "<br>";
	}
	
	var character = source_text[j];
	
	if (character == ' ')
	{
		character = '&nbsp;';
	}
	
	result_text = result_text + "<span style='color:"+f_color+"; background-color:"+b_color+";'>"+character+"</span>";
	
	
	}


return result_text;

}





function addToPatchLibrary(i)
{
	PWAD.patches[i] = new Object();
	PWAD.patches[i].id = i;
}

function parsePNAMES(i)
{
	console.log('Parsing PNAMES');
	var pnameOffset = 0;
	
	var pnameCount = read4ByteNumberFromContent(i, pnameOffset,PWAD);
	pnameOffset = pnameOffset + 4;

	for (var j=0; j<pnameCount; j++)
	{
		PWAD.pnames[j] = new Object();
		PWAD.pnames[j].name = read8ByteCharactersFromContent(i, pnameOffset,PWAD);
		pnameOffset = pnameOffset + 8;
		//Debug
		addToDebugPnames(j);
	}

	console.log('Parsing PNAMES complete');
}




function parseTexture(i)
{
	console.log('Parsing texture = '+i+' '+PWAD.textures[i].name);
	
	var canvas = document.getElementById('textureViewer');
	var ctx = canvas.getContext("2d");
	
	canvas.width = PWAD.textures[i].width;
	canvas.height = PWAD.textures[i].height;
	
	imageData = ctx.getImageData(0,0,canvas.width, canvas.height);
	//console.log(imageData);
	
	
	for (var j=0; j<PWAD.textures[i].patchCount; j++)
	{
	// for each patch, apply them to the canvas
	drawPatch(findLump(PWAD.pnames[PWAD.textures[i].patches[j].pNum].name),PWAD.textures[i].patches[j].xOffset, PWAD.textures[i].patches[j].yOffset, canvas.width, canvas.height );
	
	}


 	ctx.putImageData(imageData, 0,0);
	zoomTexture();
}


function zoomTexture()
{
	var canvas = document.getElementById('textureViewer');
	var ctx = canvas.getContext("2d");
	
	var intermediate = document.getElementById('intermediateTexture');
	var ctx_i = intermediate.getContext("2d");
	
	var zoom = document.getElementById('zoomTexture');
	
	
	intermediate.width = canvas.width * zoom.value;
	intermediate.height = canvas.height * zoom.value;
	ctx_i.drawImage(canvas, 0, 0, canvas.width * zoom.value, canvas.height * zoom.value);
	
	var finalImage = document.getElementById('finalTexture');
	finalImage.width = intermediate.width;
	finalImage.height = intermediate.height;
	finalImage.src = intermediate.toDataURL('image/png');
	


}

function drawPatch(i, xOffset, yOffset, imageWidth, imageHeight)
{
	
	if (i == -1)
	{
	console.log('Invalid Patch');
	return false;
	}
	
	console.log('Drawing patch: '+i+' at: '+xOffset+' '+yOffset);
	
	var canvas = document.getElementById('textureViewer');
	var ctx = canvas.getContext("2d");

	var header_width = read2ByteNumberFromContent(i, 0,PWAD);
	var header_height = read2ByteNumberFromContent(i,2,PWAD);
	var header_left_offset = read2ByteNumberFromContent(i,4,PWAD);
	var header_top_offset = read2ByteNumberFromContent(i,6,PWAD);

	//canvas.width = header_width;
	//canvas.height = header_height;
	
	console.log(header_width+' '+header_height+' '+header_left_offset+' '+header_top_offset);
	
	var post_offset = 8;
	
	//create the columns array
	PWAD.lumps[i].columns = new Array();
	
	// for each column, save a record
	
	for (var j=0; j<header_width; j++)
	{
		//console.log('.');
		PWAD.lumps[i].columns[j] = new Object();
		PWAD.lumps[i].columns[j].offset = read4ByteNumberFromContent(i, post_offset,PWAD);
		post_offset = post_offset + 4;
		//PWAD.lumps[i].columns[j].data = new Array();
	
	}
	
	
	// For each column in the image
	for (var j=0; j<header_width; j++)
	{
	
	// start looking for posts
	
		var column_complete = false;
		var image_offset = PWAD.lumps[i].columns[j].offset;
	

		while(column_complete == false)
		{
		
			if (read1ByteNumberFromContent(i, image_offset,PWAD) == 255)
			{
			//empty column... move to next column
				column_complete = true;
			}
			else
			{
				var row_start = read1ByteNumberFromContent(i, image_offset,PWAD);
				var row_count = read1ByteNumberFromContent(i, image_offset + 1,PWAD);
		
				image_offset = image_offset + 3; // row_start + count + not_drawn
		
				// start drawing
			
				for (var k=row_start; k<(row_start + row_count); k++)
				{
		
					var pal = read1ByteNumberFromContent(i, image_offset,PWAD);
					//console.log(pal);
					setPixel(j+xOffset, imageWidth, k+yOffset, imageHeight, PWAD.palette[pal].r, PWAD.palette[pal].g, PWAD.palette[pal].b, 255); 
		
					image_offset++;
				
				}
			// increment past the last not drawn byte
			image_offset++;
			}
		}
	}	
}



function parseTextureDirectory(i)
{
	console.log('Parsing Texture Directory - '+i);
	var textureDir = PWAD.lumps[i];


	var textureOffset = 0;
	var numTextures = read4ByteNumberFromContent(i, textureOffset,PWAD);
	
	textureOffset = textureOffset + 4;
	
	//texture directory
	for (var j=0; j<numTextures; j++)
	{
	PWAD.textures[j] = new Object();
	PWAD.textures[j].offset = read4ByteNumberFromContent(i, textureOffset,PWAD);
	
	textureOffset= textureOffset + 4;
	
	}
	// texture definitions
	for (var j=0; j<numTextures; j++)
	{
		PWAD.textures[j].name = read8ByteCharactersFromContent(i, textureOffset,PWAD);
		textureOffset = textureOffset + 8;
		//console.log(PWAD.textures[j].name);
	
		// there are 2x2 byte fields of 0 we should skip
		textureOffset = textureOffset + 4;
		
		PWAD.textures[j].width = read2ByteNumberFromContent(i, textureOffset,PWAD);
		textureOffset = textureOffset + 2;
		PWAD.textures[j].height = read2ByteNumberFromContent(i, textureOffset,PWAD);
		textureOffset = textureOffset + 2;
		
		// there are 2x2 byte fields of 0 we should skip
		textureOffset = textureOffset + 4;
		
		PWAD.textures[j].patchCount = read2ByteNumberFromContent(i, textureOffset,PWAD);
		textureOffset = textureOffset + 2;
		
		addOptionToTextureSelector(j);
		
		
		PWAD.textures[j].patches = new Array();
		
		for (var k=0; k<PWAD.textures[j].patchCount; k++)
		{
		
			PWAD.textures[j].patches[k] = new Object();
			PWAD.textures[j].patches[k].xOffset = read2ByteSignedNumberFromContent(i, textureOffset,PWAD);
			textureOffset = textureOffset + 2;
		
			PWAD.textures[j].patches[k].yOffset = read2ByteSignedNumberFromContent(i, textureOffset,PWAD);
			textureOffset = textureOffset + 2;
		
			PWAD.textures[j].patches[k].pNum = read2ByteNumberFromContent(i, textureOffset,PWAD);
			textureOffset = textureOffset + 2;
			
			PWAD.textures[j].patches[k].stepDir = read2ByteNumberFromContent(i, textureOffset,PWAD);
			textureOffset = textureOffset + 2;
		
			PWAD.textures[j].patches[k].colorMap = read2ByteNumberFromContent(i, textureOffset,PWAD);
			textureOffset = textureOffset + 2;
		
		}	
	}

console.log('Parsing Texture Directory Complete');
}

function LoadFile()
{
	var reader = new FileReader();
	reader.onerror = errorHandler;
	reader.onload = completeHandler;
	//File is the one selected in fileloader element, make this modular later
	reader.readAsBinaryString(document.getElementById('fileloader').files[0]);
}

function errorHandler(evt)
{
    switch(evt.target.error.code) {
      case evt.target.error.NOT_FOUND_ERR:
        alert('File Not Found!');
        break;
      case evt.target.error.NOT_READABLE_ERR:
        alert('File is not readable');
        break;
      case evt.target.error.ABORT_ERR:
        break; // noop
      default:
        alert('An error occurred reading this file.');
    };
}

function completeHandler(evt)
{
PWAD.file = "";

PWAD.header = new Object();
PWAD.lumps = new Array();
PWAD.palette = new Array();
PWAD.textures = new Array();
PWAD.pnames = new Array();
PWAD.patches = new Array();
PWAD.maps = new Array();

PWAD.file = evt.target.result;
PWAD.context = new AudioContext();

	LoadPWADHeader();
	LoadPWADDirectory();
	parsePWAD();
	
	//parse the default values
	//need to check if it's empty
	if (document.getElementById('sfxSelector').value != ""){
		parseSFX(document.getElementById('sfxSelector').value, false);
	}
	
	if (document.getElementById('mapSelector').value != ""){
		drawMap(document.getElementById('mapSelector').value);
	}
	
	if (document.getElementById('flatSelector').value != ""){
		parseFlat(document.getElementById('flatSelector').value);
	}
	
	if (document.getElementById('textureSelector').value != ""){
		parseTexture(document.getElementById('textureSelector').value);
	}
	
	if (document.getElementById('enemyImageSelector').value != ""){
		parseImage(document.getElementById('enemyImageSelector').value);
	}
	
}


function setPixel(x, width, y, height, r, g, b, a) {
    
    if ((x >= width)||(x < 0)||(y>=height)||(y<0))
    {
    	return -1;
    }
    
    var index = (x + y * imageData.width) * 4;
    imageData.data[index+0] = r;
    imageData.data[index+1] = g;
    imageData.data[index+2] = b;
    imageData.data[index+3] = a;
}

function findLump(name)
{
//remove
console.log(name);
	for (var i=0; i<PWAD.header.numlumps; i++)
	{
		if (PWAD.lumps[i].name == name)
		{return i;}
	}

return -1;

}

function toggleVis(element)
{
	document.getElementById('flats').style.visibility= "hidden";
	document.getElementById('images').style.visibility= "hidden";
	document.getElementById('maps').style.visibility= "hidden";
	document.getElementById('sounds').style.visibility= "hidden";
	document.getElementById('misc').style.visibility= "hidden";
	document.getElementById('textures').style.visibility= "hidden";
	document.getElementById('debug').style.visibility= "hidden";
	document.getElementById(element).style.visibility= "visible";
}


//Clean up this mess later
function storeDefaultPalette()
{
var defaultPalette = Array;

defaultPalette[0] = 0;
defaultPalette[1] =0;
defaultPalette[2] =0;
defaultPalette[3] = 31;
defaultPalette[4] =23;
defaultPalette[5] =11;
defaultPalette[6] = 23;
defaultPalette[7] =15;
defaultPalette[8] =7;
defaultPalette[9] = 75;
defaultPalette[10] =75;
defaultPalette[11] =75;
defaultPalette[12] = 255;
defaultPalette[13] =255;
defaultPalette[14] =255;
defaultPalette[15] = 27;
defaultPalette[16] =27;
defaultPalette[17] =27;
defaultPalette[18] = 19;
defaultPalette[19] =19;
defaultPalette[20] =19;
defaultPalette[21] = 11;
defaultPalette[22] =11;
defaultPalette[23] =11;
defaultPalette[24] = 7;
defaultPalette[25] =7;
defaultPalette[26] =7;
defaultPalette[27] = 47;
defaultPalette[28] =55;
defaultPalette[29] =31;
defaultPalette[30] = 35;
defaultPalette[31] =43;
defaultPalette[32] =15;
defaultPalette[33] = 23;
defaultPalette[34] =31;
defaultPalette[35] =7;
defaultPalette[36] = 15;
defaultPalette[37] =23;
defaultPalette[38] =0;
defaultPalette[39] = 79;
defaultPalette[40] =59;
defaultPalette[41] =43;
defaultPalette[42] = 71;
defaultPalette[43] =51;
defaultPalette[44] =35;
defaultPalette[45] = 63;
defaultPalette[46] =43;
defaultPalette[47] =27;
defaultPalette[48] = 255;
defaultPalette[49] =183;
defaultPalette[50] =183;
defaultPalette[51] = 247;
defaultPalette[52] =171;
defaultPalette[53] =171;
defaultPalette[54] = 243;
defaultPalette[55] =163;
defaultPalette[56] =163;
defaultPalette[57] = 235;
defaultPalette[58] =151;
defaultPalette[59] =151;
defaultPalette[60] = 231;
defaultPalette[61] =143;
defaultPalette[62] =143;
defaultPalette[63] = 223;
defaultPalette[64] =135;
defaultPalette[65] =135;
defaultPalette[66] = 219;
defaultPalette[67] =123;
defaultPalette[68] =123;
defaultPalette[69] = 211;
defaultPalette[70] =115;
defaultPalette[71] =115;
defaultPalette[72] = 203;
defaultPalette[73] =107;
defaultPalette[74] =107;
defaultPalette[75] = 199;
defaultPalette[76] =99;
defaultPalette[77] =99;
defaultPalette[78] = 191;
defaultPalette[79] =91;
defaultPalette[80] =91;
defaultPalette[81] = 187;
defaultPalette[82] =87;
defaultPalette[83] =87;
defaultPalette[84] = 179;
defaultPalette[85] =79;
defaultPalette[86] =79;
defaultPalette[87] = 175;
defaultPalette[88] =71;
defaultPalette[89] =71;
defaultPalette[90] = 167;
defaultPalette[91] =63;
defaultPalette[92] =63;
defaultPalette[93] = 163;
defaultPalette[94] =59;
defaultPalette[95] =59;
defaultPalette[96] = 155;
defaultPalette[97] =51;
defaultPalette[98] =51;
defaultPalette[99] = 151;
defaultPalette[100] =47;
defaultPalette[101] =47;
defaultPalette[102] = 143;
defaultPalette[103] =43;
defaultPalette[104] =43;
defaultPalette[105] = 139;
defaultPalette[106] =35;
defaultPalette[107] =35;
defaultPalette[108] = 131;
defaultPalette[109] =31;
defaultPalette[110] =31;
defaultPalette[111] = 127;
defaultPalette[112] =27;
defaultPalette[113] =27;
defaultPalette[114] = 119;
defaultPalette[115] =23;
defaultPalette[116] =23;
defaultPalette[117] = 115;
defaultPalette[118] =19;
defaultPalette[119] =19;
defaultPalette[120] = 107;
defaultPalette[121] =15;
defaultPalette[122] =15;
defaultPalette[123] = 103;
defaultPalette[124] =11;
defaultPalette[125] =11;
defaultPalette[126] = 95;
defaultPalette[127] =7;
defaultPalette[128] =7;
defaultPalette[129] = 91;
defaultPalette[130] =7;
defaultPalette[131] =7;
defaultPalette[132] = 83;
defaultPalette[133] =7;
defaultPalette[134] =7;
defaultPalette[135] = 79;
defaultPalette[136] =0;
defaultPalette[137] =0;
defaultPalette[138] = 71;
defaultPalette[139] =0;
defaultPalette[140] =0;
defaultPalette[141] = 67;
defaultPalette[142] =0;
defaultPalette[143] =0;
defaultPalette[144] = 255;
defaultPalette[145] =235;
defaultPalette[146] =223;
defaultPalette[147] = 255;
defaultPalette[148] =227;
defaultPalette[149] =211;
defaultPalette[150] = 255;
defaultPalette[151] =219;
defaultPalette[152] =199;
defaultPalette[153] = 255;
defaultPalette[154] =211;
defaultPalette[155] =187;
defaultPalette[156] = 255;
defaultPalette[157] =207;
defaultPalette[158] =179;
defaultPalette[159] = 255;
defaultPalette[160] =199;
defaultPalette[161] =167;
defaultPalette[162] = 255;
defaultPalette[163] =191;
defaultPalette[164] =155;
defaultPalette[165] = 255;
defaultPalette[166] =187;
defaultPalette[167] =147;
defaultPalette[168] = 255;
defaultPalette[169] =179;
defaultPalette[170] =131;
defaultPalette[171] = 247;
defaultPalette[172] =171;
defaultPalette[173] =123;
defaultPalette[174] = 239;
defaultPalette[175] =163;
defaultPalette[176] =115;
defaultPalette[177] = 231;
defaultPalette[178] =155;
defaultPalette[179] =107;
defaultPalette[180] = 223;
defaultPalette[181] =147;
defaultPalette[182] =99;
defaultPalette[183] = 215;
defaultPalette[184] =139;
defaultPalette[185] =91;
defaultPalette[186] = 207;
defaultPalette[187] =131;
defaultPalette[188] =83;
defaultPalette[189] = 203;
defaultPalette[190] =127;
defaultPalette[191] =79;
defaultPalette[192] = 191;
defaultPalette[193] =123;
defaultPalette[194] =75;
defaultPalette[195] = 179;
defaultPalette[196] =115;
defaultPalette[197] =71;
defaultPalette[198] = 171;
defaultPalette[199] =111;
defaultPalette[200] =67;
defaultPalette[201] = 163;
defaultPalette[202] =107;
defaultPalette[203] =63;
defaultPalette[204] = 155;
defaultPalette[205] =99;
defaultPalette[206] =59;
defaultPalette[207] = 143;
defaultPalette[208] =95;
defaultPalette[209] =55;
defaultPalette[210] = 135;
defaultPalette[211] =87;
defaultPalette[212] =51;
defaultPalette[213] = 127;
defaultPalette[214] =83;
defaultPalette[215] =47;
defaultPalette[216] = 119;
defaultPalette[217] =79;
defaultPalette[218] =43;
defaultPalette[219] = 107;
defaultPalette[220] =71;
defaultPalette[221] =39;
defaultPalette[222] = 95;
defaultPalette[223] =67;
defaultPalette[224] =35;
defaultPalette[225] = 83;
defaultPalette[226] =63;
defaultPalette[227] =31;
defaultPalette[228] = 75;
defaultPalette[229] =55;
defaultPalette[230] =27;
defaultPalette[231] = 63;
defaultPalette[232] =47;
defaultPalette[233] =23;
defaultPalette[234] = 51;
defaultPalette[235] =43;
defaultPalette[236] =19;
defaultPalette[237] = 43;
defaultPalette[238] =35;
defaultPalette[239] =15;
defaultPalette[240] = 239;
defaultPalette[241] =239;
defaultPalette[242] =239;
defaultPalette[243] = 231;
defaultPalette[244] =231;
defaultPalette[245] =231;
defaultPalette[246] = 223;
defaultPalette[247] =223;
defaultPalette[248] =223;
defaultPalette[249] = 219;
defaultPalette[250] =219;
defaultPalette[251] =219;
defaultPalette[252] = 211;
defaultPalette[253] =211;
defaultPalette[254] =211;
defaultPalette[255] = 203;
defaultPalette[256] =203;
defaultPalette[257] =203;
defaultPalette[258] = 199;
defaultPalette[259] =199;
defaultPalette[260] =199;
defaultPalette[261] = 191;
defaultPalette[262] =191;
defaultPalette[263] =191;
defaultPalette[264] = 183;
defaultPalette[265] =183;
defaultPalette[266] =183;
defaultPalette[267] = 179;
defaultPalette[268] =179;
defaultPalette[269] =179;
defaultPalette[270] = 171;
defaultPalette[271] =171;
defaultPalette[272] =171;
defaultPalette[273] = 167;
defaultPalette[274] =167;
defaultPalette[275] =167;
defaultPalette[276] = 159;
defaultPalette[277] =159;
defaultPalette[278] =159;
defaultPalette[279] = 151;
defaultPalette[280] =151;
defaultPalette[281] =151;
defaultPalette[282] = 147;
defaultPalette[283] =147;
defaultPalette[284] =147;
defaultPalette[285] = 139;
defaultPalette[286] =139;
defaultPalette[287] =139;
defaultPalette[288] = 131;
defaultPalette[289] =131;
defaultPalette[290] =131;
defaultPalette[291] = 127;
defaultPalette[292] =127;
defaultPalette[293] =127;
defaultPalette[294] = 119;
defaultPalette[295] =119;
defaultPalette[296] =119;
defaultPalette[297] = 111;
defaultPalette[298] =111;
defaultPalette[299] =111;
defaultPalette[300] = 107;
defaultPalette[301] =107;
defaultPalette[302] =107;
defaultPalette[303] = 99;
defaultPalette[304] =99;
defaultPalette[305] =99;
defaultPalette[306] = 91;
defaultPalette[307] =91;
defaultPalette[308] =91;
defaultPalette[309] = 87;
defaultPalette[310] =87;
defaultPalette[311] =87;
defaultPalette[312] = 79;
defaultPalette[313] =79;
defaultPalette[314] =79;
defaultPalette[315] = 71;
defaultPalette[316] =71;
defaultPalette[317] =71;
defaultPalette[318] = 67;
defaultPalette[319] =67;
defaultPalette[320] =67;
defaultPalette[321] = 59;
defaultPalette[322] =59;
defaultPalette[323] =59;
defaultPalette[324] = 55;
defaultPalette[325] =55;
defaultPalette[326] =55;
defaultPalette[327] = 47;
defaultPalette[328] =47;
defaultPalette[329] =47;
defaultPalette[330] = 39;
defaultPalette[331] =39;
defaultPalette[332] =39;
defaultPalette[333] = 35;
defaultPalette[334] =35;
defaultPalette[335] =35;
defaultPalette[336] = 119;
defaultPalette[337] =255;
defaultPalette[338] =111;
defaultPalette[339] = 111;
defaultPalette[340] =239;
defaultPalette[341] =103;
defaultPalette[342] = 103;
defaultPalette[343] =223;
defaultPalette[344] =95;
defaultPalette[345] = 95;
defaultPalette[346] =207;
defaultPalette[347] =87;
defaultPalette[348] = 91;
defaultPalette[349] =191;
defaultPalette[350] =79;
defaultPalette[351] = 83;
defaultPalette[352] =175;
defaultPalette[353] =71;
defaultPalette[354] = 75;
defaultPalette[355] =159;
defaultPalette[356] =63;
defaultPalette[357] = 67;
defaultPalette[358] =147;
defaultPalette[359] =55;
defaultPalette[360] = 63;
defaultPalette[361] =131;
defaultPalette[362] =47;
defaultPalette[363] = 55;
defaultPalette[364] =115;
defaultPalette[365] =43;
defaultPalette[366] = 47;
defaultPalette[367] =99;
defaultPalette[368] =35;
defaultPalette[369] = 39;
defaultPalette[370] =83;
defaultPalette[371] =27;
defaultPalette[372] = 31;
defaultPalette[373] =67;
defaultPalette[374] =23;
defaultPalette[375] = 23;
defaultPalette[376] =51;
defaultPalette[377] =15;
defaultPalette[378] = 19;
defaultPalette[379] =35;
defaultPalette[380] =11;
defaultPalette[381] = 11;
defaultPalette[382] =23;
defaultPalette[383] =7;
defaultPalette[384] = 191;
defaultPalette[385] =167;
defaultPalette[386] =143;
defaultPalette[387] = 183;
defaultPalette[388] =159;
defaultPalette[389] =135;
defaultPalette[390] = 175;
defaultPalette[391] =151;
defaultPalette[392] =127;
defaultPalette[393] = 167;
defaultPalette[394] =143;
defaultPalette[395] =119;
defaultPalette[396] = 159;
defaultPalette[397] =135;
defaultPalette[398] =111;
defaultPalette[399] = 155;
defaultPalette[400] =127;
defaultPalette[401] =107;
defaultPalette[402] = 147;
defaultPalette[403] =123;
defaultPalette[404] =99;
defaultPalette[405] = 139;
defaultPalette[406] =115;
defaultPalette[407] =91;
defaultPalette[408] = 131;
defaultPalette[409] =107;
defaultPalette[410] =87;
defaultPalette[411] = 123;
defaultPalette[412] =99;
defaultPalette[413] =79;
defaultPalette[414] = 119;
defaultPalette[415] =95;
defaultPalette[416] =75;
defaultPalette[417] = 111;
defaultPalette[418] =87;
defaultPalette[419] =67;
defaultPalette[420] = 103;
defaultPalette[421] =83;
defaultPalette[422] =63;
defaultPalette[423] = 95;
defaultPalette[424] =75;
defaultPalette[425] =55;
defaultPalette[426] = 87;
defaultPalette[427] =67;
defaultPalette[428] =51;
defaultPalette[429] = 83;
defaultPalette[430] =63;
defaultPalette[431] =47;
defaultPalette[432] = 159;
defaultPalette[433] =131;
defaultPalette[434] =99;
defaultPalette[435] = 143;
defaultPalette[436] =119;
defaultPalette[437] =83;
defaultPalette[438] = 131;
defaultPalette[439] =107;
defaultPalette[440] =75;
defaultPalette[441] = 119;
defaultPalette[442] =95;
defaultPalette[443] =63;
defaultPalette[444] = 103;
defaultPalette[445] =83;
defaultPalette[446] =51;
defaultPalette[447] = 91;
defaultPalette[448] =71;
defaultPalette[449] =43;
defaultPalette[450] = 79;
defaultPalette[451] =59;
defaultPalette[452] =35;
defaultPalette[453] = 67;
defaultPalette[454] =51;
defaultPalette[455] =27;
defaultPalette[456] = 123;
defaultPalette[457] =127;
defaultPalette[458] =99;
defaultPalette[459] = 111;
defaultPalette[460] =115;
defaultPalette[461] =87;
defaultPalette[462] = 103;
defaultPalette[463] =107;
defaultPalette[464] =79;
defaultPalette[465] = 91;
defaultPalette[466] =99;
defaultPalette[467] =71;
defaultPalette[468] = 83;
defaultPalette[469] =87;
defaultPalette[470] =59;
defaultPalette[471] = 71;
defaultPalette[472] =79;
defaultPalette[473] =51;
defaultPalette[474] = 63;
defaultPalette[475] =71;
defaultPalette[476] =43;
defaultPalette[477] = 55;
defaultPalette[478] =63;
defaultPalette[479] =39;
defaultPalette[480] = 255;
defaultPalette[481] =255;
defaultPalette[482] =115;
defaultPalette[483] = 235;
defaultPalette[484] =219;
defaultPalette[485] =87;
defaultPalette[486] = 215;
defaultPalette[487] =187;
defaultPalette[488] =67;
defaultPalette[489] = 195;
defaultPalette[490] =155;
defaultPalette[491] =47;
defaultPalette[492] = 175;
defaultPalette[493] =123;
defaultPalette[494] =31;
defaultPalette[495] = 155;
defaultPalette[496] =91;
defaultPalette[497] =19;
defaultPalette[498] = 135;
defaultPalette[499] =67;
defaultPalette[500] =7;
defaultPalette[501] = 115;
defaultPalette[502] =43;
defaultPalette[503] =0;
defaultPalette[504] = 255;
defaultPalette[505] =255;
defaultPalette[506] =255;
defaultPalette[507] = 255;
defaultPalette[508] =219;
defaultPalette[509] =219;
defaultPalette[510] = 255;
defaultPalette[511] =187;
defaultPalette[512] =187;
defaultPalette[513] = 255;
defaultPalette[514] =155;
defaultPalette[515] =155;
defaultPalette[516] = 255;
defaultPalette[517] =123;
defaultPalette[518] =123;
defaultPalette[519] = 255;
defaultPalette[520] =95;
defaultPalette[521] =95;
defaultPalette[522] = 255;
defaultPalette[523] =63;
defaultPalette[524] =63;
defaultPalette[525] = 255;
defaultPalette[526] =31;
defaultPalette[527] =31;
defaultPalette[528] = 255;
defaultPalette[529] =0;
defaultPalette[530] =0;
defaultPalette[531] = 239;
defaultPalette[532] =0;
defaultPalette[533] =0;
defaultPalette[534] = 227;
defaultPalette[535] =0;
defaultPalette[536] =0;
defaultPalette[537] = 215;
defaultPalette[538] =0;
defaultPalette[539] =0;
defaultPalette[540] = 203;
defaultPalette[541] =0;
defaultPalette[542] =0;
defaultPalette[543] = 191;
defaultPalette[544] =0;
defaultPalette[545] =0;
defaultPalette[546] = 179;
defaultPalette[547] =0;
defaultPalette[548] =0;
defaultPalette[549] = 167;
defaultPalette[550] =0;
defaultPalette[551] =0;
defaultPalette[552] = 155;
defaultPalette[553] =0;
defaultPalette[554] =0;
defaultPalette[555] = 139;
defaultPalette[556] =0;
defaultPalette[557] =0;
defaultPalette[558] = 127;
defaultPalette[559] =0;
defaultPalette[560] =0;
defaultPalette[561] = 115;
defaultPalette[562] =0;
defaultPalette[563] =0;
defaultPalette[564] = 103;
defaultPalette[565] =0;
defaultPalette[566] =0;
defaultPalette[567] = 91;
defaultPalette[568] =0;
defaultPalette[569] =0;
defaultPalette[570] = 79;
defaultPalette[571] =0;
defaultPalette[572] =0;
defaultPalette[573] = 67;
defaultPalette[574] =0;
defaultPalette[575] =0;
defaultPalette[576] = 231;
defaultPalette[577] =231;
defaultPalette[578] =255;
defaultPalette[579] = 199;
defaultPalette[580] =199;
defaultPalette[581] =255;
defaultPalette[582] = 171;
defaultPalette[583] =171;
defaultPalette[584] =255;
defaultPalette[585] = 143;
defaultPalette[586] =143;
defaultPalette[587] =255;
defaultPalette[588] = 115;
defaultPalette[589] =115;
defaultPalette[590] =255;
defaultPalette[591] = 83;
defaultPalette[592] =83;
defaultPalette[593] =255;
defaultPalette[594] = 55;
defaultPalette[595] =55;
defaultPalette[596] =255;
defaultPalette[597] = 27;
defaultPalette[598] =27;
defaultPalette[599] =255;
defaultPalette[600] = 0;
defaultPalette[601] =0;
defaultPalette[602] =255;
defaultPalette[603] = 0;
defaultPalette[604] =0;
defaultPalette[605] =227;
defaultPalette[606] = 0;
defaultPalette[607] =0;
defaultPalette[608] =203;
defaultPalette[609] = 0;
defaultPalette[610] =0;
defaultPalette[611] =179;
defaultPalette[612] = 0;
defaultPalette[613] =0;
defaultPalette[614] =155;
defaultPalette[615] = 0;
defaultPalette[616] =0;
defaultPalette[617] =131;
defaultPalette[618] = 0;
defaultPalette[619] =0;
defaultPalette[620] =107;
defaultPalette[621] = 0;
defaultPalette[622] =0;
defaultPalette[623] =83;
defaultPalette[624] = 255;
defaultPalette[625] =255;
defaultPalette[626] =255;
defaultPalette[627] = 255;
defaultPalette[628] =235;
defaultPalette[629] =219;
defaultPalette[630] = 255;
defaultPalette[631] =215;
defaultPalette[632] =187;
defaultPalette[633] = 255;
defaultPalette[634] =199;
defaultPalette[635] =155;
defaultPalette[636] = 255;
defaultPalette[637] =179;
defaultPalette[638] =123;
defaultPalette[639] = 255;
defaultPalette[640] =163;
defaultPalette[641] =91;
defaultPalette[642] = 255;
defaultPalette[643] =143;
defaultPalette[644] =59;
defaultPalette[645] = 255;
defaultPalette[646] =127;
defaultPalette[647] =27;
defaultPalette[648] = 243;
defaultPalette[649] =115;
defaultPalette[650] =23;
defaultPalette[651] = 235;
defaultPalette[652] =111;
defaultPalette[653] =15;
defaultPalette[654] = 223;
defaultPalette[655] =103;
defaultPalette[656] =15;
defaultPalette[657] = 215;
defaultPalette[658] =95;
defaultPalette[659] =11;
defaultPalette[660] = 203;
defaultPalette[661] =87;
defaultPalette[662] =7;
defaultPalette[663] = 195;
defaultPalette[664] =79;
defaultPalette[665] =0;
defaultPalette[666] = 183;
defaultPalette[667] =71;
defaultPalette[668] =0;
defaultPalette[669] = 175;
defaultPalette[670] =67;
defaultPalette[671] =0;
defaultPalette[672] = 255;
defaultPalette[673] =255;
defaultPalette[674] =255;
defaultPalette[675] = 255;
defaultPalette[676] =255;
defaultPalette[677] =215;
defaultPalette[678] = 255;
defaultPalette[679] =255;
defaultPalette[680] =179;
defaultPalette[681] = 255;
defaultPalette[682] =255;
defaultPalette[683] =143;
defaultPalette[684] = 255;
defaultPalette[685] =255;
defaultPalette[686] =107;
defaultPalette[687] = 255;
defaultPalette[688] =255;
defaultPalette[689] =71;
defaultPalette[690] = 255;
defaultPalette[691] =255;
defaultPalette[692] =35;
defaultPalette[693] = 255;
defaultPalette[694] =255;
defaultPalette[695] =0;
defaultPalette[696] = 167;
defaultPalette[697] =63;
defaultPalette[698] =0;
defaultPalette[699] = 159;
defaultPalette[700] =55;
defaultPalette[701] =0;
defaultPalette[702] = 147;
defaultPalette[703] =47;
defaultPalette[704] =0;
defaultPalette[705] = 135;
defaultPalette[706] =35;
defaultPalette[707] =0;
defaultPalette[708] = 79;
defaultPalette[709] =59;
defaultPalette[710] =39;
defaultPalette[711] = 67;
defaultPalette[712] =47;
defaultPalette[713] =27;
defaultPalette[714] = 55;
defaultPalette[715] =35;
defaultPalette[716] =19;
defaultPalette[717] = 47;
defaultPalette[718] =27;
defaultPalette[719] =11;
defaultPalette[720] = 0;
defaultPalette[721] =0;
defaultPalette[722] =83;
defaultPalette[723] = 0;
defaultPalette[724] =0;
defaultPalette[725] =71;
defaultPalette[726] = 0;
defaultPalette[727] =0;
defaultPalette[728] =59;
defaultPalette[729] = 0;
defaultPalette[730] =0;
defaultPalette[731] =47;
defaultPalette[732] = 0;
defaultPalette[733] =0;
defaultPalette[734] =35;
defaultPalette[735] = 0;
defaultPalette[736] =0;
defaultPalette[737] =23;
defaultPalette[738] = 0;
defaultPalette[739] =0;
defaultPalette[740] =11;
defaultPalette[741] = 0;
defaultPalette[742] =0;
defaultPalette[743] =0;
defaultPalette[744] = 255;
defaultPalette[745] =159;
defaultPalette[746] =67;
defaultPalette[747] = 255;
defaultPalette[748] =231;
defaultPalette[749] =75;
defaultPalette[750] = 255;
defaultPalette[751] =123;
defaultPalette[752] =255;
defaultPalette[753] = 255;
defaultPalette[754] =0;
defaultPalette[755] =255;
defaultPalette[756] =207;
defaultPalette[757] =0;
defaultPalette[758] =207;
defaultPalette[759] =159;
defaultPalette[760] =0;
defaultPalette[761] =155;
defaultPalette[762] =111;
defaultPalette[763] =0;
defaultPalette[764] =107;
defaultPalette[765] =167;
defaultPalette[766] =107;
defaultPalette[767] =107;

console.log("loading default palette");

var canvas = document.getElementById('playpal');
canvas.width = 256;
canvas.height = 256;

var ctx = canvas.getContext("2d");

//var palettes = PWAD.lumps[i].content;

var pal_i = 0;

for (var i=0; i<256; i++)
{
	ctx.fillStyle = 'rgb('+defaultPalette[pal_i]+','+defaultPalette[pal_i+1]+','+defaultPalette[pal_i + 2]+')';
	ctx.fillRect(Math.floor(i/16)*16,i%16*16, 16, 16);

	PWAD.palette[i] = new Object();
	PWAD.palette[i].r = defaultPalette[pal_i];
	PWAD.palette[i].g = defaultPalette[pal_i+1];
	PWAD.palette[i].b = defaultPalette[pal_i+2];
	
		pal_i = pal_i + 3;
}

}