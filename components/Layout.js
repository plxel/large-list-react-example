import React, {Component} from 'react'
import Head from 'next/head'
import RaisedButton from 'material-ui/RaisedButton'
import {deepOrange500} from 'material-ui/styles/colors'
import getMuiTheme from 'material-ui/styles/getMuiTheme'
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider'
import injectTapEventPlugin from 'react-tap-event-plugin'

if (!process.tapEventInjected) {
  injectTapEventPlugin()
  process.tapEventInjected = true
}

const muiTheme = {
  palette: {
    accent1Color: deepOrange500
  }
}

export default (props) => (
  <MuiThemeProvider muiTheme={getMuiTheme({...muiTheme})}>
    <div>
      <Head>
        <meta name="viewport" content={"width=device-width, initial-scale=1"}/>
      </Head>
      {props.children}
      <style jsx global>{`
        * {
          box-sizing: border-box;
        }

        @media (max-width: 767px) {
          .md-btn {

            width: 100px;
          }
          .md-btn span {
            font-size: 12px !important;
            padding: 0px !important;
          }
          .md-btn svg {
            margin-right: 0px !important;
            width: 15px !important;
            height: 15px !important;
          }

        }
      `}</style>
    </div>


  </MuiThemeProvider>
)
