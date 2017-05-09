import React, { Component } from 'react';
import {
  Text,
  Image,
} from 'react-native';
import { connect } from 'react-redux';
import { Button, Container, Content, Icon, Input, Item, Label } from 'native-base';
import { Col, Grid, Row } from 'react-native-easy-grid';
import BlockButton from '../../components/BlockButton';
import styles from './EditProfileStyles';
import icEditGreen from '../../../images/icons/ic_edit_green.png';
import rest from '../../utils/rest';

const mapStateToProps = state => ({
  teacher: state.teacherDetails.data,
  teacherId: state.login.decoded.id,
});
const mapDispatchToProps = dispatch => ({
  refresh: teacherId => dispatch(rest.actions.teacherDetails({ teacherId })),
  saveChanges: (teacher, callback) => console.log(teacher) || dispatch(rest.actions.profile.post({}, {
    body: JSON.stringify(teacher),
  }, callback)),
});

@connect(mapStateToProps, mapDispatchToProps)
class EditProfileView extends Component {
  static navigationOptions = {
    tabBar: () => ({
      icon: ({ tintColor: color }) => (
        <Icon name="person" style={{ color }} />
      ),
      visible: true,
    }),
    header: () => ({
      style: {
        backgroundColor: '#333333',
      },
      titleStyle: {
        color: '#15a369',
      },
      tintColor: '#15a369',
    }),
    title: 'Edit school',
  };

  state = {
    company: '',
    subjects: [],
    edStage: '',
  };

  constructor(props) {
    super(props);

    const { teacher } = props;

    this.state = {
      company: teacher.company,
      subjects: teacher.subjects,
      edStage: teacher.edStage,
    };
  }

  render() {
    const { teacher, teacherId } = this.props;
    const subjectMap = teacher.subjects || [];
    console.log('render');

    return (
      <Container>
        <Content padder>
          <Grid style={styles.profileGrid}>
            <Row>
              <Col>
                <Text style={styles.headlineStyle}>School: </Text>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item stackedLabel last>
                  <Label style={styles.labelStyle}>Name of school</Label>
                  <Input onChangeText={company => this.setState({ company })} value={this.state.company} />
                </Item>
              </Col>
            </Row>
            <Row>
              <Col>
                <Item stackedLabel last>
                  <Label style={styles.labelStyle}>Subjects</Label>
                  {
                    this.state.subjects.map((subject, index) => (
                      <Input
                        key={subject}
                        onChangeText={(text) => {
                          let subjects = [];

                          if (this.state) {
                            subjects = JSON.parse(JSON.stringify(this.state.subjects));
                          }

                          subjects[index] = text;
                          this.setState({ subjects });
                        }} defaultValue={`${subject}`}
                      />
                    ))
                  }
                  <Input onChangeText={subject => this.setState({ subjects: [subject] })} />
                </Item>
              </Col>
            </Row>

            <Row>
              <Col>
                <Item stackedLabel last>
                  <Label style={styles.labelStyle}>Educational stage</Label>
                  <Input onChangeText={edStage => this.setState({ edStage })} value={this.state.edStage} />
                </Item>
              </Col>
            </Row>
          </Grid>
        </Content>
        <BlockButton
          text="SAVE CHANGES" onPress={() => this.props.saveChanges(this.state, () => {
            this.props.navigation.goBack();
            this.props.refresh(teacherId);
          })}
        />
      </Container>
    );
  }
}

export default EditProfileView;
