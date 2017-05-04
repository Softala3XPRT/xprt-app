import React, { Component } from 'react';
import {
  Text,
  View,
  Linking,
} from 'react-native';
import { Body, Badge, Button, Container, Content, Icon, Spinner, Thumbnail } from 'native-base';
import { Col, Row, Grid } from 'react-native-easy-grid';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';

import rest from '../../utils/rest';

// import defaultProfile from '../../../images/icons/ic_person.png';
import styles from './expertDetailStyles';

const mapStateToProps = (state, ownProps) => ({
  expert: state.expertDetails.data,
  loading: state.expertDetails.loading,
  expertId: ownProps.navigation.state.params.expertId,
  inviteLectureDisabled: ownProps.navigation.state.params.inviteLectureDisabled,
});
const mapDispatchToProps = dispatch => ({
  getExpertDetails(expertId) {
    dispatch(rest.actions.expertDetails({ expertId }));
  },
  navigate: bindActionCreators(NavigationActions.navigate, dispatch),
});

@connect(mapStateToProps, mapDispatchToProps)
export default class ExpertDetailsView extends Component {
  static navigationOptions = {
    header: styles.headerStyle,
  };

  componentDidMount() {
    this.props.getExpertDetails(this.props.expertId);
  //  this.props.getExperts();
  }
  open = (expert) => {
    this.props.navigate({
      routeName: 'LectureInvitation',
      params: {
        expert,
      },
    });
  };
  openUrl = (url) => {
    Linking.canOpenURL(url).then((supported) => {
      if (supported) {
        Linking.openURL(url);
      } else {
        console.log('Is not abels to open url:', url);
      }
    });
  };

  render() {
    const { expert, loading, inviteLectureDisabled } = this.props;
    // const thumbnailSource = expert.imageUrl ? { uri: expert.imageUrl } : defaultProfile;
    const subjects = expert.subjects || [];
    const areas = expert.area || [];

    const numb = Math.floor(Math.random() * 50);
    const uri = `https://randomuser.me/api/portraits/women/${numb}.jpg`;

    return (loading ? (
      <Container>
        <Content>
          <Spinner color={styles.spinner.color} />
        </Content>
      </Container>
    ) : (
      <Container>
        <Content>
          <Grid style={styles.profileGrid}>
            <Row>
              <Col style={styles.profileGridCol}>
                <Button
                  transparent style={styles.iconButton}
                  warning onPress={() => { this.openUrl(`mailto: ${expert.email}?subject=DISSUBJECT&body=DISBODY`); }}
                >
                  <Icon name="mail" />
                </Button>
              </Col>
              <Col style={styles.profileGridCol}>
                <Thumbnail style={styles.avatarLarge} source={{ uri }} />
              </Col>
              <Col style={styles.profileGridCol}>
                <Button
                  transparent style={styles.iconButton}
                  warning onPress={() => { this.openUrl(`tel: ${expert.phone}`); }}
                >
                  <Icon name="call" />
                </Button>
              </Col>
            </Row>
            <Row>
              <Body>
                <Text style={styles.name}> {expert.name} </Text>
                <Text style={styles.lightText}> {expert.title} </Text>
                <View style={styles.visitRow}>
                  <Text style={styles.subjectText}> Visit possible: </Text>
                  {
                    areas.map(area => (
                      <Text style={styles.subjectText} key={area}> {area} </Text>
                    ))
                  }
                </View>
                <View style={styles.labelRowflow}>
                  {
                    subjects.map(subject => (
                      <Badge style={styles.subjectBadge} key={subject}>
                        <Text style={styles.subjectText}> {subject} </Text>
                      </Badge>
                    ))
                  }
                </View>
              </Body>
            </Row>
          </Grid>
          <Grid style={styles.aboutGrid}>
            <Row>
              <Text style={styles.aboutText}>About {expert.name}:</Text>
            </Row>
            <Row>
              <Text style={styles.description} note>{expert.description}</Text>
            </Row>
          </Grid>
        </Content>
        {inviteLectureDisabled ? null :
        <Button
          large block style={styles.blockButton}
          key={expert.id} onPress={() => { this.open(expert); }}
        >
          <Text style={styles.blockButtonText}>SEND A LECTURE INVITATION</Text>
        </Button>
        }
      </Container>
    ));
  }
}
