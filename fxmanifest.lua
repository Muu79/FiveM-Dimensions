fx_version 'cerulean'
game 'gta5'
lua54 'yes'



-- Client Scripts

client_scripts {
    'client/client.lua'
}


-- Server Scripts

server_scripts{
    'server/server.lua'
}

-- Nui Info

ui_page 'nui/nui.html'

files {
    'nui/my-app/src/nui.html',
    'nui/css/style.css',
    'nui/css/fonts.css',
    'nui/fonts/*',
    'nui/script.js',
    'nui/images/*',
    'nui/node_modules/*'
}