import MdConvertor from '../utils/utils'
import { MarkdownManager } from '../Manager/md-manager'




export default {
    namespace: 'page',
    state: {
        html: '',
        docList: [],
        sideHide: false,
        cover: window.$trumpDoc.cover,
        isLoading: false
    },
    reducer: {
        loading(state, { payload }) {
            return { ...state, isLoading: payload }
        },
        toDocs(state) {
            return { ...state, cover: false }
        },
        mapHtml(state, { payload }) {
            console.log({ html: payload })
            return { ...state, html: payload }
        },
        mapDocList(state, { payload }) {
            return { ...state, docList: payload }
        },
        sideChange(state, { payload }) {
            const { sideHide, docList } = payload
            return { ...state, docList, sideHide }
        }
    },

    effects: {
        *fetchMenu({ put, select }, { payload }) {
            const pageState = yield select(state => state.page)

            yield put({
                type: 'sideChange',
                payload: {
                    docList: [...pageState.docList],
                    sideHide: payload
                }
            })
        },
        *fetchDocList({ put, call, fork }, { payload }) {
            const mdmanager = new MarkdownManager()
            const rawTexts = yield mdmanager.getMardownList()

            const newDocList = rawTexts.map((item, index) => {
                const instance = new MdConvertor()
                const convertor = instance.init()
                const md = item.isWebUrl
                    ? item.rawMarkdown
                    : convertor.makeHtml(item.rawMarkdown)
                return {
                    isWebUrl: item.isWebUrl,
                    title: item.title,
                    mdText: md,
                    headers: instance.header
                }
            })

            yield put({
                type: 'mapDocList',
                payload: newDocList
            })

            //maping the first artcle in the list to page
            if (newDocList.length > 0) {
                yield put({
                    type: 'mapHtml',
                    payload: newDocList[0].mdText
                })
            }
        },
        *renderDocs({ put, call, select }, { payload }) {
            const docList = yield select(state => state.page.docList)
            const item = docList.find(item => item.title === payload)

            if (item.headers.length === 0) {
                if (item.isWebUrl) window.open(item.mdText)
                return
            }
            yield put({
                type: 'mapHtml',
                payload: item.mdText
            })
        }
    }
}

// const regexobject: {
//   headline: /^(\#{1,6})([^\#\n]+)$/m,
//   code: /\s\`\`\`\n?([^`]+)\`\`\`/g,
//   hr: /^(?:([\*\-_] ?)+)\1\1$/gm,
//   lists: /^((\s*((\*|\-)|\d(\.|\))) [^\n]+)\n)+/gm,
//   bolditalic: /(?:([\*_~]{1,3}))([^\*_~\n]+[^\*_~\s])\1/g,
//   links: /!?\[([^\]<>]+)\]\(([^ \)<>]+)( "[^\(\)\"]+")?\)/g,
//   reflinks: /\[([^\]]+)\]\[([^\]]+)\]/g,
//   smlinks: /\@([a-z0-9]{3,})\@(t|gh|fb|gp|adn)/gi,
//   mail: /<(([a-z0-9_\-\.])+\@([a-z0-9_\-\.])+\.([a-z]{2,7}))>/gmi,
//   tables: /\n(([^|\n]+ *\| *)+([^|\n]+\n))((:?\-+:?\|)+(:?\-+:?)*\n)((([^|\n]+ *\| *)+([^|\n]+)\n)+)/g,
//   include: /[\[<]include (\S+) from (https?:\/\/[a-z0-9\.\-]+\.[a-z]{2,9}[a-z0-9\.\-\?\&\/]+)[\]>]/gi,
//   url: /<([a-zA-Z0-9@:%_\+.~#?&\/=]{2,256}\.[a-z]{2,4}\b(\/[\-a-zA-Z0-9@:%_\+.~#?&\/\/=]*)?)>/g
// }
