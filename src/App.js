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
    TouchableHighlight
} from 'react-native';

const iTxtMaxSize = 150;
const iTxtMinSize = 50;

const iRandomMin = 1;
const iRandomMax = 20;

const iLives = 3;

export default class MainApp extends Component {
    constructor(props) {
        super(props);
            this.state = {
                _targetNumber: this._generateRandomInteger(),
                _textSize: iTxtMinSize,
                _incrementSizeFlag: true,
                _randomNumber: 0,
                _iAttemp: 0,
                _caughtNumber: '',
                _gameOver: false,
                _msg: ''
            };
    
        //Basic Animation
        setInterval(() => {
            let curTextSize = this.state._textSize;
            let flag = this.state._incrementSizeFlag;
            let curNumber = this.state._randomNumber;
            
            //Random Number
            if (curNumber>=iRandomMax) {
                curNumber = 0;
            }
            else curNumber++;
            
            //Text Animation
            if (curTextSize>=iTxtMaxSize) {
                flag = false;
            }
            else if(curTextSize<=iTxtMinSize){
                flag = true;
            }
            
            
            this.setState({
                _incrementSizeFlag: flag,
                _randomNumber: curNumber
            },
                () => {
                    this.state._incrementSizeFlag ? curTextSize++ : curTextSize--;
                    this.setState({
                        _textSize: curTextSize
                    });
                }
            )
                
        }, 100);

        // Toggle for Random Number Scan
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

    _generateRandomInteger =  () =>
    {
        return Math.floor(Math.random()*(iRandomMax-iRandomMin+1)+iRandomMin);
    }

    _getTxtSize = () => {
        return(
            {
                fontSize: this.state._textSize
            }
        )
    }

    _fireAttemp = () => {
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
    }

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
                    style={styles.imgBackground}
                    source={require('./assets/img/blue.jpg')}
                />
                <View style={styles.titleCont}>
                    <Text style={styles.txtTitle}>
                        TARGET NUMBER
                    </Text>
                </View>
                <View style={styles.targetNumberCont}>
                    <View style={styles.targetNumberPlaceholder}>
                        <Text style={[styles.txtTargetNumber, this._getTxtSize()]}> 
                            {this.state._targetNumber}
                        </Text>
                    </View>
                </View>
                
                <View style={styles.randomCaughtCont}>
                    <View style={styles.randomNumberCont}>
                        <Text style={styles.txtRandomNumer}>
                            {this.state._randomNumber}
                        </Text>
                    </View>
                    <View style={styles.caughtNumberCont}>
                        <Text style={styles.txtCaughtNumber}>
                            {this.state._caughtNumber}
                        </Text>
                    </View>
                </View>

                <View style={styles.attempCont}>
                    <View style={[styles.attempWrapper, this._getBackgroundColor(1)]}>
                    </View>
                    <View style={[styles.attempWrapper, this._getBackgroundColor(2)]}>
                    </View>
                    <View style={[styles.attempWrapper, this._getBackgroundColor(3)]}>
                    </View>
                </View>
                <View style={styles.buttonsCont}>
                    <TouchableOpacity 
                        onPress={() => this._fireAttemp()}>
                        <View style={styles.btnWrapper}>
                            <Text style={styles.txtBtnLabel}> CATCH ME ! </Text>
                        </View>
                    </TouchableOpacity>
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

    titleCont: {
        minHeight: 50,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center',
        marginTop: 20
    },

    targetNumberCont:{
        flex: 0.25,
        backgroundColor: 'transparent',
        alignItems: 'center',
        justifyContent: 'center'
    },

    randomCaughtCont:{
        flex: 0.4,
        backgroundColor: 'orange',
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
        color: '#000',
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

    randomNumberCont: {
        flex: 0.7,
        alignItems: 'center',
        justifyContent: 'center'
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
    }


});