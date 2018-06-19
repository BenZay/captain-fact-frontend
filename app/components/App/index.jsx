import React from 'react'
import { connect } from 'react-redux'
import { I18nextProvider } from 'react-i18next'
import { Helmet } from 'react-helmet'

import i18n from '../../i18n/i18n'
import { FlashMessages } from '../Utils'
import { fetchCurrentUser } from '../../state/users/current_user/effects'
import { MainModalContainer } from '../Modal/MainModalContainer'
import Sidebar from './Sidebar'
import PublicAchievementUnlocker from '../Users/PublicAchievementUnlocker'
import OnBoarding from './OnBoarding'

@connect(state => ({
  locale: state.UserPreferences.locale
}), {
  fetchCurrentUser
})
export default class App extends React.Component {
  componentDidMount() {
    this.props.fetchCurrentUser()
  }

  render() {
    return (
      <I18nextProvider i18n={i18n}>
        <div lang={this.props.locale}>
          <Helmet>
            <title>CaptainFact</title>
          </Helmet>
          <MainModalContainer/>
          <OnBoarding/>
          <div className="columns is-mobile is-gapless">
            <Sidebar className="column is-narrow" />
            <div id="main-container" className="column">
              {this.props.children}
            </div>
          </div>
          <FlashMessages/>
          <PublicAchievementUnlocker
            achievementId={4}
            meetConditionsFunc={this.checkExtensionInstalled}
          />
        </div>
      </I18nextProvider>
    )
  }

  /**
   * Extension content scripts load after CaptainFact. We could have created
   * a message interface to communicate between the two but as our need
   * is very basic for now (detecting if extension is installed) we wait 5
   * seconds and check.
   *
   * @returns {Promise}
   */
  checkExtensionInstalled() {
    return new Promise(fulfill => {
      setTimeout(() =>
        fulfill(!!document.getElementById('captainfact-extension-installed'))
        , 5000
      )
    })
  }
}
