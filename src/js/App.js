import React, { Component } from 'react';
import App from 'grommet/components/App';
import Box from 'grommet/components/Box';
import Anchor from 'grommet/components/Anchor';
import Header from 'grommet/components/Header';
import Footer from 'grommet/components/Footer';
import Title from 'grommet/components/Title';
import TodoAppDashboard from './components/TodoAppDashboard';
import Headline from 'grommet/components/Headline';

export default class SampleApp extends Component {
  render() {
    return (
      <App centered={true}>
        <Box full={true} margin='small' >
          <Header margin='none' direction='row' justify='between' align='baseline'
            pad={{ horizontal: 'medium' }}>
            <Headline strong='true'>Notes Map</Headline>
          </Header>
          
          <TodoAppDashboard />
        </Box>
      </App>
    );
  }
}
