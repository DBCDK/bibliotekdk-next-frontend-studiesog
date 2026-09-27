#!groovy​

@Library('dependency-track') _

def app

def DT_TEAM_NAME = "febib"
def DT_PROJECT_TYPE = "javascript"
def OUTPUT_FOLDER = "./dependency-track-folder"
def SBOM_TYPE = "application"
def DT_PROJECTS = [
    [folder: "."],
].collect { project ->
    [
        folder: project.folder,
        sbomType: project.sbomType ?: SBOM_TYPE,
        teamName: project.teamName ?: DT_TEAM_NAME,
        projectType: project.projectType ?: DT_PROJECT_TYPE,
        outputFolder: project.outputFolder ?: OUTPUT_FOLDER
    ]
}

pipeline {
    agent {
        label 'devel11'
    }
    triggers {
        githubPush()
        upstream(
          upstreamProjects: env.BRANCH_NAME == "main" ? 'Docker-base-node-bump-trigger' : ''
        )
    }
    environment {
        IMAGE_NAME = "studiesog-${env.BRANCH_NAME.toLowerCase()}:${BUILD_NUMBER}"
        DOCKER_COMPOSE_NAME = "compose-${IMAGE_NAME}-${BRANCH_NAME.toLowerCase()}"
        GITLAB_PRIVATE_TOKEN = credentials("metascrum-gitlab-api-token")
        GITLAB_ID = "1806"
        CLIENT_ID = credentials("bibdk_client_id")
        CLIENT_SECRET = credentials("bibdk_client_secret")
    }
    stages {
        stage('clean workspace') {
            steps {
                cleanWs()
                checkout scm
            }
        }
        stage("Supply Chain Gate") {
            agent {
                docker {
                    label 'devel11'
                    image "docker-dbc.artifacts.dbccloud.dk/dbc-node:node25"
                    alwaysPull true
                }
            }
            steps {
                script {
                    for (def project : DT_PROJECTS) {
                        dir(project.folder) {
                            generateSbomNpm(
                                sbomType: project.sbomType,
                                outputFolder: project.outputFolder
                            )
                            dependencyTrackGate(
                                projectBom: "${project.outputFolder}/sbom.json",
                                projectTeam: project.teamName,
                                projectType: project.projectType,
                                *:(fileExists("${project.outputFolder}/vex.json") ? [projectVex: "${project.outputFolder}/vex.json"] : [:])
                            )
                        }
                    }
                }
            }
        }
        stage('Build image') {
            steps {
                script {
                    currentBuild.description = "Build ${IMAGE_NAME}"
                    ansiColor("xterm") {
                        // Work around bug https://issues.jenkins-ci.org/browse/JENKINS-44609 , https://issues.jenkins-ci.org/browse/JENKINS-44789
                        sh "docker build -t ${IMAGE_NAME} --pull ."
                        app = docker.image(IMAGE_NAME)
                    }
                }
            }
        }
        stage('Integration test') {
            steps {
                script {
                    ansiColor("xterm") {
                        sh "docker pull docker-dbc.artifacts.dbccloud.dk/dbc-cypress:latest"
                        sh "docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} build"
                        sh "IMAGE=${IMAGE_NAME} docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} run --rm e2e"
                    }
                }
            }
        }
        stage('Push to Artifactory') {
            when {
                anyOf {
                    branch 'main';
                }
            }
            steps {
                script {
                    if (currentBuild.resultIsBetterOrEqualTo('SUCCESS')) {
                        docker.withRegistry('https://docker-frontend.artifacts.dbccloud.dk', 'docker') {
                            app.push()
                            app.push("latest")
                        }
                    }
                }
            }
        }

        stage("Update staging version number") {
            agent {
                docker {
                    label 'devel11'
                    image "docker-dbc.artifacts.dbccloud.dk/build-env:latest"
                    alwaysPull true
                }
            }
            when {
                anyOf {
                    branch 'main';
                }
            }
            steps {
                dir("deploy") {
                    script {
                        if (env.BRANCH_NAME == 'main') {
                            sh '''
                                #!/usr/bin/env bash                        
                                set-new-version configuration.yaml ${GITLAB_PRIVATE_TOKEN} ${GITLAB_ID} ${BUILD_NUMBER} -b staging
                            '''
                        } 
                      
                    }
                }
            }
        }
    }
    post {
        always {
            sh '''
                echo Clean up
                mkdir -p logs
                docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} logs web > logs/web-log.txt
                docker-compose -f docker-compose-cypress.yml -p ${DOCKER_COMPOSE_NAME} down -v
                docker rmi ${IMAGE_NAME}
            '''

            junit skipPublishingChecks: true, testResults: 'app/e2e/reports/*.xml'
            archiveArtifacts 'cypress/screenshots/*, cypress/videos/*, logs/*'
        }
        failure {
            script {
                if ("${BRANCH_NAME}" == 'main') {
                    slackSend(channel: 'fe-drift',
                        color: 'warning',
                        message: "${JOB_NAME} #${BUILD_NUMBER} failed and needs attention: ${BUILD_URL}",
                        tokenCredentialId: 'slack-global-integration-token'
                    )

                    slackSend(
                        channel: 'febib-developers',
                        color: 'danger',
                        message: "🚨 Hov, Studiesøg prod build failed 🚨"
                    )
                }
            }
        }
        success {
            script {
                if ("${BRANCH_NAME}" == 'main') {
                    slackSend(channel: 'fe-drift',
                            color: 'good',
                            message: "${JOB_NAME} #${BUILD_NUMBER} completed, and pushed ${IMAGE_NAME} to artifactory.",
                            tokenCredentialId: 'slack-global-integration-token')

                }
            }
        }
        fixed {
            slackSend(channel: 'fe-drift',
                    color: 'good',
                    message: "${JOB_NAME} #${BUILD_NUMBER} back to normal: ${BUILD_URL}",
                    tokenCredentialId: 'slack-global-integration-token')

        }
    }
}
