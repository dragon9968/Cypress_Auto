pipeline {
    environment {
        CONTAINER_NAME = 'bc/range_frontend'
        VERSION = '0.13.0'
        APP_PORT = 4200
        HOST_PORT = 4200
    }
    agent any
    stages {
        stage('Build the image') {
            when {
                branch "dev"
            }
            steps {
                sh "docker build -t ${CONTAINER_NAME}:${VERSION} ."
            }
        }
        stage('Stop the running containers on the port') {
            when {
                branch "dev"
            }
            steps {
                sh "chmod +x ./stop_container_by_port.sh"
                sh "./stop_container_by_port.sh ${APP_PORT}"
            }
        }
        stage('Run the container') {
            when {
                branch "dev"
            }
            steps {
                sh "docker run -d --rm -p ${HOST_PORT}:${APP_PORT} ${CONTAINER_NAME}:${VERSION}"
            }
        }
    }
    post {
        always {
            cleanWs()
        }
    }
}