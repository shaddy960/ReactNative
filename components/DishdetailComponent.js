import React, { Component } from 'react';
import { Text, View, ScrollView, FlatList, Modal, StyleSheet, Button, Alert, PanResponder } from 'react-native';
import { Card, Icon, Rating, Input } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';
import { connect } from 'react-redux';
import { baseUrl } from '../shared/baseUrl';
import { postFavorite, postComment } from '../redux/ActionCreators';

const mapStateToProps = state => {
    return {
        dishes: state.dishes,
        comments: state.comments,
        favorites: state.favorites
    }
}

const mapDispatchToProps = dispatch => ({
    postFavorite: (dishId) => dispatch(postFavorite(dishId)),
    postComment: (dishId, rating, author, comment) => dispatch(postComment(dishId, rating, author, comment))
})

function RenderDish(props) {

    const dish = props.dish;

    handleViewRef = ref => this.view = ref;

    const recognizeDrag = ({ moveX, moveY, dx, dy }) => {
        if (dx < -200)
            return true;
        else
            return false;
    }

    const recognizeComment = ({ moveX, moveY, dx, dy }) => {
        if (dx > 200)
            return true;
        else
            return false;
    }

    const panResponder = PanResponder.create({
        onStartShouldSetPanResponder: (e, gestureState) => {
            return true;
        },
        onPanResponderGrant: () => {
            this.view.rubberBand(1000).then(endState => console.log(endState.finished ? 'finished' : 'cancelled'));
        },

        onPanResponderEnd: (e, gestureState) => {
            console.log("pan responder end", gestureState);
            if (recognizeDrag(gestureState)) {
                Alert.alert(
                    'Add Favorite',
                    'Are you sure you wish to add ' + dish.name + ' to favorite?',
                    [
                        { text: 'Cancel', onPress: () => console.log('Cancel Pressed'), style: 'cancel' },
                        { text: 'OK', onPress: () => { props.favorite ? console.log('Already favorite') : props.onPress() } },
                    ],
                    { cancelable: false }
                );
            }else if(recognizeComment(gestureState)){
                props.onPress1();
            }
            return true;
        }
    })

    if (dish != null) {
        return (
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}
                ref={this.handleViewRef}
                {...panResponder.panHandlers}>
                <Card
                    featuredTitle={dish.name}
                    image={{ uri: baseUrl + dish.image }}>
                    <Text style={{ margin: 10 }}>
                        {dish.description}
                    </Text>
                    <View style={{ alignItems: 'center', flexDirection: 'row', justifyContent: 'center' }}>
                        <Icon
                            raised
                            reverse
                            name={props.favorite ? 'heart' : 'heart-o'}
                            type='font-awesome'
                            color='#f50'
                            onPress={() => props.favorite ? console.log('Already favorite') : props.onPress()}
                        />
                        <Icon
                            raised
                            reverse
                            name={'pencil'}
                            type='font-awesome'
                            color='#0000FF'
                            onPress={() => props.onPress1()}
                        />
                    </View>
                </Card>
            </Animatable.View>
        );
    }
    else {
        return (<View></View>);
    }
}

function RenderComments(props) {

    const comments = props.comments;

    const renderCommentItem = ({ item, index }) => {

        return (
            <View key={index} style={{ margin: 10 }}>
                <Text style={{ fontSize: 14 }}>{item.comment}</Text>
                <Rating
                    imageSize={12}
                    readonly
                    startingValue={item.rating}
                    style={{ marginVertical: 10, alignSelf: 'flex-start' }}
                />
                <Text style={{ fontSize: 12 }}>{'-- ' + item.author + ', ' + item.date} </Text>
            </View>
        );
    };

    return (
        <Animatable.View animation="fadeInUp" duration={2000} delay={1000}>
            <Card title='Comments' >
                <FlatList
                    data={comments}
                    renderItem={renderCommentItem}
                    keyExtractor={item => item.id.toString()}
                />
            </Card>
        </Animatable.View>

    );
}

class Dishdetail extends Component {

    constructor(props) {
        super(props);

        this.state = {
            showModal: false,
            dishId: '',
            rating: '',
            author: '',
            comment: ''
        }
    }

    static navigationOptions = {
        title: 'Dish Details'
    };

    toggleModal() {
        this.setState({ showModal: !this.state.showModal });
    }

    handleCommentForm(dishId) {
        this.props.postComment(dishId, this.state.rating, this.state.author, this.state.comment);
        this.toggleModal();
    }

    resetForm() {
        this.setState({
            showModal: false,
            dishId: '',
            rating: '',
            author: '',
            comment: ''
        });
    }

    markFavorite(dishId) {

        this.props.postFavorite(dishId);
    }

    render() {
        const dishId = this.props.navigation.getParam('dishId', '');

        return (
            <ScrollView>
                <RenderDish dish={this.props.dishes.dishes[+dishId]}
                    favorite={this.props.favorites.some(el => el === dishId)}
                    onPress={() => this.markFavorite(dishId)}
                    onPress1={() => this.toggleModal()}
                />
                <RenderComments comments={this.props.comments.comments.filter((comment) => comment.dishId === dishId)} />
                <Modal animationType={"slide"} transparent={false}
                    visible={this.state.showModal}
                    onDismiss={() => this.toggleModal()}
                    onRequestClose={() => this.toggleModal()}>
                    <View>
                        <Text style={styles.formLabel}>Rating</Text>
                        <Rating showRating startingValue="{3}" onFinishRating={(value) => this.setState({ rating: value })} />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Input
                            placeholder='Author'
                            leftIcon={{ type: 'font-awesome', name: 'user' }}
                            onChangeText={(value) => this.setState({ author: value })}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Text style={styles.formLabel}></Text>
                        <Input
                            placeholder='Comment'
                            leftIcon={{ type: 'font-awesome', name: 'comment' }}
                            onChangeText={(value) => this.setState({ comment: value })}
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.handleCommentForm(dishId)}
                            title="Submit"
                            color="#512DA8"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                    <View style={styles.formRow}>
                        <Button
                            onPress={() => this.toggleModal()}
                            title="Cancel"
                            color="#808080"
                            accessibilityLabel="Learn more about this purple button"
                        />
                    </View>
                </Modal>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    formRow: {
        marginTop: 10
    },
    formLabel: {
        fontSize: 18,
        flex: 5
    },
    formItem: {
        flex: 1
    },
    modal: {
        justifyContent: 'center',
        margin: 20
    },
    modalTitle: {
        fontSize: 24,
        fontWeight: 'bold',
        backgroundColor: '#512DA8',
        textAlign: 'center',
        color: 'white',
        marginBottom: 20
    },
    modalText: {
        fontSize: 18,
        margin: 10
    }

});

export default connect(mapStateToProps, mapDispatchToProps)(Dishdetail);