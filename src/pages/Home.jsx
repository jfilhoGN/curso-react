import React, { Component } from 'react';
import { Button, Container, Form, FormControl, InputGroup, Row, Alert } from 'react-bootstrap';
import ListaTweet from '../components/ListaTweet';
import UserService from '../services/UserService';
import UserList from '../components/UserList';
import TweetService from '../services/TweetService';
import { connect } from 'react-redux';

class Home extends Component {

    state = {
        currentPost: '',
        alertVisible: false,
        users: [],
        tweets: []
    };

    componentDidMount = () => {
        UserService.getAllUsers().then(users => {
            this.setState({ users });
        })
        if (this.props.usuarioLogado !== undefined) {
            this.getUserFeed(this.props.usuarioLogado);
        }
    }

    componentDidUpdate(oldProps) {
        if (this.props.usuarioLogado !== oldProps.usuarioLogado) {
            this.getUserFeed(this.props.usuarioLogado);
        }
    }

    getUserFeed = (user) => {
        this.setState(() => {
            TweetService.getUserFeed(user)
                .then(tweets => {
                    this.setState({ tweets });
                })
        })
    }

    onChange = (event) => {
        this.setState({ currentPost: event.target.value })
    };

    onPost = () => {

        const { usuarioLogado } = this.props;

        if (!usuarioLogado) {
            this.setState({ alertVisible: true })
            return;
        }

        const content = this.state.currentPost;

        this.setState({ currentPost: '', alertVisible: false }, () => {
            TweetService.newTweet(content)
                .then(() => setTimeout(() => this.getUserFeed(usuarioLogado), 1500))
        })
    };

    render() {

        const { currentPost, alertVisible, users, tweets } = this.state;

        return (
            <Container style={{ marginTop: 30 }}>
                <Alert variant="danger" defaultShow={alertVisible}>
                    Você deve estar logado para postar alguma coisa.
                </Alert>
                <UserList users={users} />
                <Form>
                    <Row>
                        <span className="ml-auto">{currentPost.length} / 140</span>
                        <InputGroup>
                            <FormControl as="textarea" aria-label="With textarea" maxLength={140}
                                value={currentPost} onChange={this.onChange} />
                        </InputGroup>
                    </Row>
                    <Row style={{ justifyContent: 'flex-end', marginTop: 10 }}>
                        <Button variant="primary" onClick={this.onPost}>Postar</Button>
                    </Row>

                    <Row>
                        <ListaTweet tweets={tweets} />
                    </Row>
                </Form>
            </Container>
        )
    }
}

const mapStateToProps = (state) => {
    return {
        usuarioLogado: state.usuario.usuarioAtual
    }
}

export default connect(mapStateToProps)(Home);
