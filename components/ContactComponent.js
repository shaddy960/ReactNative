import React, { Component } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { Card } from 'react-native-elements';
import * as Animatable from 'react-native-animatable';

function RenderAddress() {

    return (
        <ScrollView>
            <Animatable.View animation="fadeInDown" duration={2000} delay={1000}>
                <Card title='Contact Information'>
                    <Text style={{ margin: 10 }}>
                        {`121, Clear Water Bay Road\n\nClear Water Bay, Kowloon\n\nHONG KONG\n\nTel: +852 1234 5678\n\nFax: +852 8765 4321\n\nEmail:confusion@food.net`}
                    </Text>
                </Card>
            </Animatable.View>
        </ScrollView>
    );

}

class Contact extends Component {

    static navigationOptions = {
        title: 'Contact Us'
    };

    render() {
        return (
            <RenderAddress />
        );
    }
}

export default Contact;