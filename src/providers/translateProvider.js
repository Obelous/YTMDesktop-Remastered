const { ipcMain } = require('electron')
const i18n = require('i18n')
const settingsProvider = require('./settingsProvider')

const defaultLocale = settingsProvider.get('settings-app-language', 'en')

i18n.configure({
    locales: ['en', 'pt'],
    directory: __dirname + '/../locales',
    defaultLocale: defaultLocale,
})

function setLocale(locale) {
    i18n.setLocale(locale)
}

function trans(id, params) {
    params = typeof params !== 'undefined' ? params : {}
    try {
        let tmp = i18n.__(id, params)
        if (tmp === id) {
            return i18n.__({ phrase: id, locale: 'en' }, params) // fallback to english
        } else {
            return tmp
        }
    } catch (_) {
        return i18n.__({ phrase: id, locale: 'en' }, params) // fallback to english
    }
}

function translateHelper() {
    const prefix = 'i18n_'
    var items = []
    var i18n_items = document.getElementsByTagName('*')
    for (var i = 0; i < i18n_items.length; i++) {
        //omitting undefined null check for brevity
        if (
            i18n_items[i].getAttribute('i18n') &&
            i18n_items[i].getAttribute('i18n').lastIndexOf(prefix, 0) === 0
        ) {
            items.push([
                i18n_items[i].getAttribute('i18n').replace('i18n_', ''),
                i18n_items[i],
            ])
        }
    }
    return items
}

function loadi18n() {
    translateHelper().forEach(([i18n, element]) => {
        element.innerHTML = trans(i18n)
    })
}

if (ipcMain) {
    ipcMain.on('I18N_TRANSLATE', (e, id, params) => {
        e.returnValue = trans(id, params)
    })
}

module.exports = {
    setLocale: setLocale,
    trans: trans,
    loadi18n: loadi18n,
}
