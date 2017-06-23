import React, {Component} from 'react'
import RaisedButton from 'material-ui/RaisedButton'
import Link from 'next/link'
import Layout from '../components/Layout'

const styles = {
  container: {
    textAlign: 'center',
    paddingTop: 200
  }
}

const Index = () => (
    <Layout>
      <div style={styles.container}>
        <h1>Project example</h1>
        <h2>Large user list</h2>
        <Link href="/users">
          <RaisedButton
          label="Go to task page"
          secondary={Boolean(true)}
          />
        </Link>
      </div>
    </Layout>
);

export default Index
