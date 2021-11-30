"use strict";
const { default: makeWASocket, BufferJSON, initInMemoryKeyStore, DisconnectReason, AnyMessageContent, delay, useSingleFileAuthState } = require("@adiwajshing/baileys-md")
const figlet = require("figlet");
const fs = require("fs");
const P = require('fatal')
const ind = require('./help/ind')
const { color, SenkuLog } = require("./lib/color");
let setting = JSON.parse(fs.readFileSync('./config.json'));
let sesion = `./${setting.sessionName}.json`
const { state, saveState } = useSingleFileAuthState(sesion)

const start = async () => {
    //Meng weem
	console.log(color(figlet.textSync('©Mecha Senku', {
		font: 'Standard',
		horizontalLayout: 'default',
		vertivalLayout: 'default',
		whitespaceBreak: false
	}), 'cyan'))
	console.log(color('[ By Rashidsiregar28 ]'))
    // set level pino ke fatal kalo ga mau nampilin log eror
    const Senku = makeWASocket({ printQRInTerminal: true, logger: P({ level: 'debug' }), auth: state }) 
    console.log(color('Connected....'))
    Senku.multi = true
    Senku.nopref = false
    Senku.prefa = 'anjing'

    Senku.ev.on('messages.upsert', async m => {
    	if (!m.messages) return
        const msg = m.messages[0]
        require('./message/Senku')(Senku, msg, m, ind, setting)
    })

    Senku.ev.on('connection.update', (update) => {
        const { connection, lastDisconnect } = update
        if (connection === 'close') {
            console.log(SenkuLog('Error with code', lastDisconnect.error.output.statusCode))
            lastDisconnect.error?.output?.statusCode !== DisconnectReason.loggedOut ? start() : console.log(SenkuLog('Wa web terlogout.'))
        }
    })

    Senku.ev.on('creds.update', () => saveState)

    return Senku
}

start()
.catch(err => console.log(err))
