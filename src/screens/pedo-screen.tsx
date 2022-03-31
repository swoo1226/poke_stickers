import React from 'react';
import { StyleSheet, Text } from 'react-native';
import { Box, VStack } from 'native-base';
import { Pedometer } from 'expo-sensors';
import NavBar from '../components/navbar';
export default class PedoScreen extends React.Component {
  state = {
    isPedometerAvailable: 'checking',
    pastStepCount: 0,
    currentStepCount: 0,
  };
    _subscription: Pedometer.Subscription | null | undefined;

  componentDidMount() {
    this._subscribe();
  }

  componentWillUnmount() {
    this._unsubscribe();
  }

  _subscribe = () => {
    this._subscription = Pedometer.watchStepCount(result => {
      this.setState({
        currentStepCount: result.steps,
      });
    });

    Pedometer.isAvailableAsync().then(
      result => {
        this.setState({
          isPedometerAvailable: String(result),
        });
      },
      error => {
        this.setState({
          isPedometerAvailable: 'Could not get isPedometerAvailable: ' + error,
        });
      }
    );

    const end = new Date();
    const start = new Date();
    start.setDate(end.getDate() - 1);
    Pedometer.getStepCountAsync(start, end).then(
      result => {
        this.setState({ pastStepCount: result.steps });
      },
      error => {
        this.setState({
          pastStepCount: 'Could not get stepCount: ' + error,
        });
      }
    );
  };

  _unsubscribe = () => {
    this._subscription && this._subscription.remove();
    this._subscription = null;
  };

  render() {
    return (
        <Box _dark={{bg: 'blueGray.900'}} _light={{bg: 'blueGray.50'}} px={5} flex={1}>
            <NavBar />  
            <VStack space={5} alignItems="center" justifyContent='center'>
                <Text>Pedometer.isAvailableAsync(): {this.state.isPedometerAvailable}</Text>
                <Text>Steps taken in the last 24 hours: {this.state.pastStepCount}</Text>
                <Text>Walk! And watch this go up: {this.state.currentStepCount}</Text>
            </VStack>
        </Box>
    );
  }
}

const styles = StyleSheet.create({
    container: {
        height: '100%',
    }
})