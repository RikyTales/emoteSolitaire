var emotes = []
var params = window.location.search.slice(1)
var searchParams = new URLSearchParams(params)
var channel = searchParams.get("channel") || "rikitales"
var bg = searchParams.get("bg")
var solitaire = searchParams.get("solitaire")

var currentEmotes = []
var options = {
    options: {
        debug: false
    },
    connection: {
        reconnect: true,
        secure: true
    },
    channels: [`#${channel}`]
}

var client = new tmi.client(options)
client.connect()

client.on("chat", function(channel, userstate, message, self) {
    for (var key in userstate.emotes) {
        for (var j = 0; j < userstate.emotes[key].length; j++) {
            emotes.push(new Emote(key))
        }
    }
})

function setup() {
    createCanvas(window.innerWidth, window.innerHeight)
    background(7)
    if (bg == "none") {
        clear()
    }
}

function draw() {
    if (solitaire == "none") {
        clear()
    }
    for (var i = emotes.length-1; i >= 0; i--) {
        emotes[i].update()
    }
}

function Emote(img) {
    this.x = random(200, width - 200)
    this.y = random(height/5, height/6)
    this.speedX = random(-4, 4)
    this.speedY = random(-16, 16)
    this.lifespan = 250
    this.img = loadImage(`https://static-cdn.jtvnw.net/emoticons/v1/${img}/2.0`)

    this.update = function() {
        this.x += this.speedX
        this.y += this.speedY
        this.lifespan--

        image(this.img, this.x, this.y)

        if (this.x > window.innerWidth + 50 || this.x < 0 - 50 || this.lifespan < -50) {
            var index = emotes.indexOf(this)
            emotes.splice(index, 1)
        }
        if (this.y > window.innerHeight - 70) {
            if (this.lifespan < 0) {
                this.speedY += 0.98
            } else {
                this.y = window.innerHeight - 70
                this.speedY = -this.speedY * 0.85
            }
        }
        this.speedY += 0.98
    }
}