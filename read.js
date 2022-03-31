const { LAVA_HOST, LAVA_PASSWORD, LAVA_PORT, spCID, spCS  } = require('./config');
const { Manager } = require("erela.js");
const Spotify  = require("erela.js-spotify");
const { MessageEmbed } = require("discord.js")

module.exports = async client => {
    console.log(`${client.user.username} is available now!`)
    var activities = [ `${client.guilds.cache.size} servers`, `${client.users.cache.size} users!` ], i = 0;
    setInterval(() => client.user.setActivity(`help | ${activities[i++ % activities.length]}`, { type: "WATCHING" }),5000)
  //=================================== MUSIC STUFF =============================================

  const nodes = [
    {
      host: LAVA_HOST,
      password: LAVA_PASSWORD,
      port: LAVA_PORT,
    }
  ];
  
  const clientID = spCID;
  const clientSecret = spCS;

  //HERE spCID and spCS are your SPOTIFY APPLICATION'S ID AND SECRET. MAKE AN APP ON SPOTIFY'S WEB DEV PORTAL TO ACCESS THE TOKEN KEYS
  client.manager = new Manager({
    nodes,
    plugins: [ new Spotify({ clientID, clientSecret }) ],
    autoPlay: true,
    secure: false,
    send: (id, payload) => {
      const guild = client.guilds.cache.get(id);
      if (guild) guild.shard.send(payload);
    }
  });
//initialize the manager
  client.manager.init(client.user.id);

  console.log(`Logged in as ${client.user.tag}`);
  
  //on node connect. NOTE: NODE HERE IS YOUR LAVALINK NODE/Server
  client.manager.on("nodeConnect", node => {
      console.log(`Node "${node.options.identifier}" connected.`)
  })
  

  //Node error event
  client.manager.on("nodeError", (node, error) => {
      console.log(`Node "${node.options.identifier}" encountered an error: ${error.message}.`)
  })
  
  client.on("raw", d => client.manager.updateVoiceState(d));

  //Track start
  client.manager.on("trackStart", (player, track) => {
    const channel = client.channels.cache.get(player.textChannel);
    let min = Math.floor((track.duration/1000/60) << 0), sec = Math.floor((track.duration/1000) % 60);
    let sec2;
      if(sec < 10) {
          sec2 = `0${sec}`
      }
      else {
          sec2 = sec
      }

      //Embed sent after the track starts playing.
    let np = new MessageEmbed()
    .setColor("#d9d9d9")
    .setDescription(`**Now playing:** \n\`${track.title}\`\nRquested by [ ${track.requester} ]\nDuration: [ \`${min}:${sec2}\` ]`)
    channel.send(np).then(m => m.delete({ timeout: track.duration }));
  });
  
  // Emitted when the player queue ends
  client.manager.on("queueEnd", player => {
    const channel = client.channels.cache.get(player.textChannel);
    channel.send("Queue has ended. Bye! :wave: ");
    player.destroy();
  });
  
  
   //When someone manually disconnects the client. it justs destroys the player.
	client.manager.on("socketClosed", (player, payload) => {
		if(payload.byRemote === true) player.destroy();
	});
	client.manager.on("playerMove", (player, currentChannel, newChannel) => {
		if(!newChannel) player.destroy();
		else player.voiceChannel = newChannel;
	});
  
    
};