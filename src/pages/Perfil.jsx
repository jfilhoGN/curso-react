import React, { Component } from 'react';
import { Button, Container, Row } from 'react-bootstrap';
import ListaTweet from '../components/ListaTweet';
import UserService from '../services/UserService';
import TweetService from '../services/TweetService';
import { connect } from 'react-redux';

class Perfil extends Component {

    state = {
        //loading: false,
        tweets: [],
        user: {}
    };

    componentDidMount = () => {
        const { id } = this.props.match.params;
        this.setState(() => {
            UserService.getUserData(id)
                .then(user => {
                    this.setState({ user: user })
                    TweetService.getUserTweets(user)
                        .then(tweets => {
                            this.setState({ tweets: tweets })
                        })
                })
        })
    }

    onFollow = user => {
        UserService.followUser(user).then(() =>
            alert("Você esta seguindo " + user.userName));
    }


    render() {
        const { user, tweets } = this.state;
        const { usuarioLogado } = this.props

        const shouldShowFollowButton = usuarioLogado !== undefined && user !== undefined && usuarioLogado.uid !== user.uid;
        return (
            <Container>
                <Row className="profile-section">
                    <img src={user.photoURL} alt="foto do perfil do usuário"
                        className="profile-photo" />
                    <div className="profile-data">
                        <span>{user.displayName}</span>
                        <span>{`@${user.userName}`}</span>
                    </div>
                    {shouldShowFollowButton &&
                        <div className="ml-auto">
                            <Button onClick={() => this.onFollow(user)}>Seguir</Button>
                        </div>
                    }
                </Row>
                <Row>
                    <ListaTweet tweets={tweets} />
                </Row>
            </Container>
        );
    }
}

const mapStateToProps = (state) => {
    return {
        usuarioLogado: state.usuario.usuarioAtual
    }
}


export default connect(mapStateToProps)(Perfil);