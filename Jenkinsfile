pipeline {
    environment {
        BUILD_ENV = 'test'
    }
    agent any
    stages {
        stage('Build and deploy the image locally') {
            steps {
                sh "./nightly-build.sh"
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}