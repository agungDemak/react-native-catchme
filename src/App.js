/**
 * Author: Jovanni Auxilio
 * Repository: https://github.com/jovanxua/CatchMe/
 */
import React, { Component } from 'react';
import {
    Text, 
    View,
    StyleSheet,
    Image,
    TouchableOpacity,
    Modal,
    Animated
} from 'react-native';
const iRandomMin = 1;
const iRandomMax = 100;
const iLives = 3;

class RandomNumber extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            _dTxtSize: new Animated.Value(this.props.min),
        };
    }
  
    componentDidMount() {   
        this._zoomAnimation();     
    }

    _zoomAnimation = () => {
        Animated.loop(
            Animated.sequence([
                Animated.timing(this.state._dTxtSize, {
                toValue: this.props.max,
                duration: 2000,
                }),
                Animated.timing(this.state._dTxtSize, {
                toValue: this.props.min,
                duration: 2000
                })
            ])
        ).start()  
    }
    
    render() {
        const spin = this.state._dTxtSize.interpolate({
            inputRange: [this.props.min, this.props.max],
            outputRange: ['0deg', '360deg']
          })

        return (
            <View style={{justifyContent: 'center', alignItems: 'center'}}>   
                <Animated.Image
                    resizeMode='contain'
                    style={{transform: [{rotate: spin}], width: this.state._dTxtSize}}
                    source={require('./assets/img/sun.png')}
                />
                <Animated.Text style={{...this.props.style, position: 'absolute', top: 0, bottom: 0, right: 0, left: 0, justifyContent: 'center', alignItems: 'center', fontSize: this.state._dTxtSize}}>
                    {this.props.children}
                </Animated.Text>
            </View>
      );
    }
}

class NumberScanner extends React.Component {
    constructor(props) {
        super(props);
            this.state = {
                _incrementSizeFlag: true,
                _iCurrentNumer: iRandomMin,
                _sendNumberToParent: false
            };
    
        //Basic Animation
        setInterval(() => {
            let curNumber = this.state._iCurrentNumer;
            
            //Random Number
            if (curNumber>=iRandomMax) {
                curNumber = 0;
            }
            else curNumber++;
            
            this.setState({
                _iCurrentNumer: curNumber
            })
        }, 20);

        // Toggle for Random Number Scan
    }

    componentDidMount(){
        this._initProps();
    }

    componentWillReceiveProps(next){
        if(this.state._sendNumberToParent !== next.onBtnPress){
            this.setState({
                _sendNumberToParent: next.onBtnPress
            },
                () => {
                    this._catchTriggerAction();
                }
            )
        }
    }

    _initProps = () => {
        this.setState({
            _sendNumberToParent: this.props.onBtnPress
        })
    }

    _catchTriggerAction = () => {
        this.props.caught(this.state._iCurrentNumer)
    }

    render(){
        return(
            <TouchableOpacity activeOpacity={0.5} onPress={ () => this._catchTriggerAction()}>
                <View style={styles.randomNumberCont}>
                    <Text style={styles.txtRandomNumer}>
                        {this.state._iCurrentNumer}
                    </Text>
                </View>
            </TouchableOpacity>
        )
    }
}

export default class MainApp extends Component {
    constructor(props) {
        super(props);
        this.state = {
            _targetNumber: this._generateRandomInteger(),
            _incrementSizeFlag: true,
            _randomNumber: 0,
            _iAttemp: 0,
            _gameOver: false,
            _msg: '',

            _onCatch: false,
            _caughtNumber: ''
        };

        this.catchNumber = this.catchNumber.bind(this);
    }
    
    _generateRandomInteger =  () =>{
        return Math.floor(Math.random()*(iRandomMax-iRandomMin+1)+iRandomMin);
    }

    _getBackgroundColor = (index) => {
        if (index <= this.state._iAttemp){
            return (
                {
                    backgroundColor: '#f00'
                }
            )
        }
        else{
            return (
                {
                    backgroundColor: '#fff'
                }
            )
        }
    }

    _getTxtSize = () => {
        return(
            {
                fontSize: this.state._textSize
            }
        )
    }

    _fireAttemp = () => {
        this.setState({
            _onCatch: true
        })
    }

    catchNumber(curNumber){
        this.setState({
            _caughtNumber: curNumber,
            _onCatch: false
        },)
    }


/*     _fireAttemp = () => {
        let curTargetNumber = this.state._targetNumber;
        let curCaughtNumer = this.state._randomNumber;
        console.log('curTargetNumber: ' + curTargetNumber);
        console.log('curCaughtNumer: ' + curCaughtNumer);

        if ( curTargetNumber != curCaughtNumer){
            let curAttemp = this.state._iAttemp;
            curAttemp++;
            this.setState({
                _iAttemp: curAttemp,
                _caughtNumber: curCaughtNumer
            },
                () => {
                    if (this.state._iAttemp >= iLives){
                        this.setState({
                            _msg: 'GAME OVER !',
                            _gameOver: true,
                        })
                    }
                }
            )
        }
        else {
            this.setState({
                _msg: 'Congrats! \n You caught me.',
                _gameOver: true,
            })
        }
    } */

    _playAgain = () => {
        this.setState({
            _targetNumber: this._generateRandomInteger(),
            _textSize: iTxtMinSize,
            _incrementSizeFlag: true,
            _randomNumber: 0,
            _iAttemp: 0,
            _caughtNumber: '',
            _gameOver: false,
            _msg: ''
        })

    }

    _getMsgColor = () => {
        if (this.state._iAttemp >= iLives){
            return(
                {
                    color: '#f00'
                }
            )
        }
        else {
            return(
                {
                    color: '#008000'
                }
            )
        }
    }

    render() {
        return (
            <View style = {styles.container}>
                <Image
                    resizeMode='stretch'
                    style={styles.imgBackground}
                    source={require('./assets/img/background1.png')}
                />
                <View style={styles.menuCont}>
                    <Text style={styles.txtMenu}>Menu</Text> 
                </View>
                <View style={styles.titleCont}>
                    <RandomNumber min={120} max={200} style={{color: '#fff'}}>
                  {/*       {this.state._targetNumber} */}
                    </RandomNumber>
                </View>
                <View style={styles.targetNumberCont}>
                    
                </View>
                
                <View style={styles.randomCaughtCont}>
                    <NumberScanner onBtnPress={this.state._onCatch} caught={this.catchNumber}/>
                    <View style={styles.caughtNumberCont}>
                        <Text style={styles.txtCaughtNumber}>
                            {this.state._caughtNumber}
                        </Text>
                    </View>
                </View>

                <Modal
                    animationType="slide"
                    transparent={true}
                    visible={this.state._gameOver}
                    onRequestClose={() => {}}
                    >
                    <View style={styles.modalCont}>
                        <View style={styles.modalForm}>
                            <View style={styles.modalMsgCont}>
                                <Text style={[styles.txtGameOver, this._getMsgColor()]}>
                                    {this.state._msg}
                                </Text>
                            </View>
                            <View style={styles.modalBtnCont}>
                                <TouchableOpacity 
                                    onPress={() => this._playAgain()}>
                                    <View style={styles.btnPlayAgain}>
                                        <Text style={styles.txtBtnLabel}> Play Again </Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </View>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        flexDirection: 'column'
    },

    imgBackground: {
        backgroundColor: '#ccc',
        flex: 1,
        position: 'absolute',
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },

    menuCont: {
        minHeight: 30,
        backgroundColor: 'rgba(0, 0, 0, 0.6);',
        justifyContent: 'center',
        alignItems: 'flex-start'
    },

    titleCont: {
        maxHeight: 200,
        maxHeight: 200,
        backgroundColor: 'rgba(255, 255, 255, 0.5);',
        alignItems: 'center',
        justifyContent: 'center',
    },

    targetNumberCont:{
        flex: 0.25,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },

    randomCaughtCont:{
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center'
    },

    attempCont:{
        flex: 0.1,
        maxHeight: 30,
        flexDirection: 'row'
    },

    buttonsCont:{
        flex: 0.25,
        flexDirection: 'row',
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },

    txtTargetNumber: {
        textAlign: 'center',
        color: '#008000',
        fontFamily: 'Helvetica-Light'
    },

    txtTitle: {
        textAlign: 'center',
        color: '#FFF',
        fontSize: 40,
        fontWeight: '500'
    },

    txtRandomNumer: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 100,
        fontWeight: '200',
        fontFamily: 'Helvetica-Light',
    },

    txtCaughtNumber: {
        textAlign: 'center',
        color: '#f00',
        fontSize: 50,
        fontWeight: '100',
        fontFamily: 'Helvetica-Light',
    },

    txtMenu: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 12,
        fontWeight: '200',
        fontFamily: 'Helvetica-Light',
        padding: 5 
    },

    randomNumberCont: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'rgba(205, 0, 0, 0.9);',
        borderRadius: 100,
        width: 200,
        height: 200,
        borderWidth: 0.7,
        borderColor: 'gray'
    },

    caughtNumberCont: {
        flex: 0.3,
        alignItems: 'center',
    },

    txtBtnLabel: {
        textAlign: 'center',
        color: '#fff',
        fontSize: 20,
        fontWeight: '200',
        fontFamily: 'Helvetica-Light'
    },

    txtGameOver:{
        textAlign: 'center',
        fontSize: 30,
        fontWeight: '200',
        fontFamily: 'Helvetica-Light'   
    },

    btnWrapper: {
        backgroundColor: 'rgba(0, 138, 37, 0.7)',
        width: 300,
        height: 60,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },

    btnPlayAgain: {
        backgroundColor: 'rgba(0, 28, 138, 0.8)',
        width: 150,
        height: 50,
        borderRadius: 100,
        alignItems: 'center',
        justifyContent: 'center'
    },

    attempWrapper: {
        flex: 0.3333,
        borderWidth: 0.7,
        borderColor: 'gray'
    },

    modalCont: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.6);',
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalForm: {
        flexDirection: 'column',
        width: '80%',
        height: '60%',
        backgroundColor: '#fff',
        borderRadius: 20,
        flexDirection: 'column'
    },

    modalMsgCont: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },

    modalBtnCont: {
        flex: 0.5,
        justifyContent: 'center',
        alignItems: 'center'
    },

});