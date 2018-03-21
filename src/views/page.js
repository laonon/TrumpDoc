import React from 'react'
import { connect } from 'react-redux'

import './index.css'
import { Canvas } from '../component/canvas'

class PageContainer extends React.Component {
    shouldComponentUpdate(nextProps) {
        return this.props.html !== nextProps.html
    }
    componentDidMount(){
        console.log('渲染')
    }

    render() {
        const { html } = this.props
        console.log(html)
        return (
            <div
                className="content-wapper"
                dangerouslySetInnerHTML={{ __html: html }}
            />
        )
    }
}

const mapStateToProps = state => {
   
    return state.page
}

export default connect(mapStateToProps)(PageContainer)
