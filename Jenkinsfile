// pipeline {
//     agent any
//     options {
//         skipStagesAfterUnstable()
//         disableRestartFromStage()
//     }
//     tools {
//         nodejs "nodejs"
//     }
//     stages {
//         stage('install') {
//             when {
//                 anyOf{
//                     expression{env.BRANCH_NAME == 'main'}
//                     expression{env.BRANCH_NAME == 'deploy-prod'}
//                 }
//             }
//             steps {
//                 sh 'npm install'
//             }
//         }

//         stage('create-env-dev') {
//             when {
//                 branch 'main'
//             }
//             environment {
//                 ADPOLL_API_QA_PORT = credentials("ADPOLL_API_QA_PORT")
//                 ADPOLL_API_QA_REMOTE_API_URL = credentials("ADPOLL_API_QA_REMOTE_API_URL")
//                 ADPOLL_API_QA_REMOTE_BASE_URL = credentials("ADPOLL_API_QA_REMOTE_BASE_URL")
//                 ADPOLL_API_QA_NODE_ENV = credentials("ADPOLL_API_QA_NODE_ENV")
//                 ADPOLL_API_QA_MYSQL_HOST = credentials("ADPOLL_API_QA_MYSQL_HOST")
//                 ADPOLL_API_QA_MYSQL_USER = credentials("ADPOLL_API_QA_MYSQL_USER")
//                 ADPOLL_API_QA_MYSQL_PASSWORD = credentials("ADPOLL_API_QA_MYSQL_PASSWORD")
//                 ADPOLL_API_QA_MYSQL_DATABASE = credentials("ADPOLL_API_QA_MYSQL_DATABASE")
//                 ADPOLL_API_QA_MYSQL_PORT = credentials("ADPOLL_API_QA_MYSQL_PORT")
//                 ADPOLL_API_QA_APP_MAIL = credentials("ADPOLL_API_QA_APP_MAIL")
//                 ADPOLL_API_QA_APP_MAIL_PASSWORD = credentials("ADPOLL_API_QA_APP_MAIL_PASSWORD")
//                 ADPOLL_API_QA_SMTP_HOST = credentials("ADPOLL_API_QA_SMTP_HOST")
//                 ADPOLL_API_QA_SMTP_PORT = credentials("ADPOLL_API_QA_SMTP_PORT")
//                 ADPOLL_API_QA_PHONE_VERIFY_OTP_EXPIRATION_MINUTES = credentials("ADPOLL_API_QA_PHONE_VERIFY_OTP_EXPIRATION_MINUTES")
//                 ADPOLL_API_QA_JWT_SECRET = credentials("ADPOLL_API_QA_JWT_SECRET")
//                 ADPOLL_API_QA_JWT_ACCESS_EXPIRATION_MINUTES = credentials("ADPOLL_API_QA_JWT_ACCESS_EXPIRATION_MINUTES")
//                 ADPOLL_API_QA_JWT_REFRESH_EXPIRATION_DAYS = credentials("ADPOLL_API_QA_JWT_REFRESH_EXPIRATION_DAYS")
//                 ADPOLL_API_QA_JWT_RESET_PASSWORD_EXPIRATION_MINUTES = credentials("ADPOLL_API_QA_JWT_RESET_PASSWORD_EXPIRATION_MINUTES")
//                 ADPOLL_API_QA_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES = credentials("ADPOLL_API_QA_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES")
//                 ADPOLL_API_QA_PUBLISHABLE_KEY = credentials("ADPOLL_API_QA_PUBLISHABLE_KEY")
//                 ADPOLL_API_QA_SECRET_KEY = credentials("ADPOLL_API_QA_SECRET_KEY")
// 				ADPOLL_API_QA_PASSWORD_ENCRYPTOR_DECRYPTOR_KEY = credentials("ADPOLL_API_QA_PASSWORD_ENCRYPTOR_DECRYPTOR_KEY")
// 				ADPOLL_API_QA_TWILIO_ACCOUNT_SID = credentials("ADPOLL_API_QA_TWILIO_ACCOUNT_SID")
// 				ADPOLL_API_QA_TWILIO_AUTH_TOKEN = credentials("ADPOLL_API_QA_TWILIO_AUTH_TOKEN")
// 				ADPOLL_API_QA_TWILIO_SERVICE_SID = credentials("ADPOLL_API_QA_TWILIO_SERVICE_SID")
// 				ADPOLL_API_QA_GOOGLE_CLIENT_ID = credentials("ADPOLL_API_QA_GOOGLE_CLIENT_ID")
// 				ADPOLL_API_QA_GOOGLE_CLIENT_SECRET = credentials("ADPOLL_API_QA_GOOGLE_CLIENT_SECRET")
// 				ADPOLL_API_QA_GOOGLE_AUTH_CALLBACK_URL = credentials("ADPOLL_API_QA_GOOGLE_AUTH_CALLBACK_URL")
// 				ADPOLL_API_QA_TWITTER_CLIENT_ID = credentials("ADPOLL_API_QA_TWITTER_CLIENT_ID")
// 				ADPOLL_API_QA_TWITTER_CLIENT_SECRET = credentials("ADPOLL_API_QA_TWITTER_CLIENT_SECRET")
// 				ADPOLL_API_QA_TWITTER_REDIRECT_URI = credentials("ADPOLL_API_QA_TWITTER_REDIRECT_URI")
// 				ADPOLL_API_QA_ADMIN_MAIL = credentials("ADPOLL_API_QA_ADMIN_MAIL")
// 				ADPOLL_API_QA_AWS_SECRET_ACCESS_KEY = credentials("ADPOLL_API_QA_AWS_SECRET_ACCESS_KEY")
// 				ADPOLL_API_QA_AWS_ACCESS_KEY = credentials("ADPOLL_API_QA_AWS_ACCESS_KEY")
// 				ADPOLL_API_QA_AWS_REGION = credentials("ADPOLL_API_QA_AWS_REGION")
// 				ADPOLL_API_QA_AWS_BUCKET_NAME = credentials("ADPOLL_API_QA_AWS_BUCKET_NAME")
// 		    	ADPOLL_API_QA_SESSION_SECRET = credentials("ADPOLL_API_QA_SESSION_SECRET")
// 		    	ADPOLL_API_QA_FACEBOOK_APP_ID = credentials("ADPOLL_API_QA_FACEBOOK_APP_ID")
// 		    	ADPOLL_API_QA_FACEBOOK_APP_SECRET = credentials("ADPOLL_API_QA_FACEBOOK_APP_SECRET")
// 		    	ADPOLL_API_QA_FACEBOOK_AUTH_CALLBACK_URL = credentials("ADPOLL_API_QA_FACEBOOK_AUTH_CALLBACK_URL")
// 		    	ADPOLL_API_QA_INVITE_EXPIRATION_MINUTES = credentials("ADPOLL_API_QA_INVITE_EXPIRATION_MINUTES")
// 		    	ADPOLL_API_QA_APPLE_PRIVATE_KEY = credentials("ADPOLL_API_QA_APPLE_PRIVATE_KEY")
// 		    	ADPOLL_API_QA_STRIPE_SECRET_KEY = credentials("ADPOLL_API_QA_STRIPE_SECRET_KEY")
// 		    	ADPOLL_API_QA_TWILIO_PHONE_NUMBER = credentials("ADPOLL_API_QA_TWILIO_PHONE_NUMBER")	

//                 ADPOLL_API_QA_IP = credentials("ADPOLL_API_QA_IP")
//                 BRANCH_NAME = '${env.BRANCH_NAME}'
//             }
//             steps {
//                 echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
//                 sh '''#!/bin/bash
//                 touch .env
//                 echo PORT=$ADPOLL_API_QA_PORT >> .env
//                 echo REMOTE_API_URL=$ADPOLL_API_QA_REMOTE_API_URL >> .env
//                 echo REMOTE_BASE_URL=$ADPOLL_API_QA_REMOTE_BASE_URL >> .env
//                 echo NODE_ENV=$ADPOLL_API_QA_NODE_ENV >> .env
//                 echo MYSQL_HOST=$ADPOLL_API_QA_MYSQL_HOST >> .env
//                 echo MYSQL_USER=$ADPOLL_API_QA_MYSQL_USER >> .env
//                 echo MYSQL_PASSWORD=$ADPOLL_API_QA_MYSQL_PASSWORD >> .env
//                 echo MYSQL_DATABASE=$ADPOLL_API_QA_MYSQL_DATABASE >> .env
//                 echo MYSQL_PORT=$ADPOLL_API_QA_MYSQL_PORT >> .env
//                 echo APP_MAIL=$ADPOLL_API_QA_APP_MAIL >> .env
//                 echo APP_MAIL_PASSWORD=$ADPOLL_API_QA_APP_MAIL_PASSWORD >> .env
//                 echo SMTP_HOST=$ADPOLL_API_QA_SMTP_HOST >> .env
//                 echo SMTP_PORT=$ADPOLL_API_QA_SMTP_PORT >> .env
//                 echo PHONE_VERIFY_OTP_EXPIRATION_MINUTES=$ADPOLL_API_QA_PHONE_VERIFY_OTP_EXPIRATION_MINUTES >> .env
// 				echo JWT_SECRET=$ADPOLL_API_QA_JWT_SECRET >> .env
// 				echo JWT_ACCESS_EXPIRATION_MINUTES=$ADPOLL_API_QA_JWT_ACCESS_EXPIRATION_MINUTES >> .env
// 				echo JWT_REFRESH_EXPIRATION_DAYS=$ADPOLL_API_QA_JWT_REFRESH_EXPIRATION_DAYS >> .env
// 				echo JWT_RESET_PASSWORD_EXPIRATION_MINUTES=$ADPOLL_API_QA_JWT_RESET_PASSWORD_EXPIRATION_MINUTES >> .env
// 				echo JWT_VERIFY_EMAIL_EXPIRATION_MINUTES=$ADPOLL_API_QA_JWT_VERIFY_EMAIL_EXPIRATION_MINUTES >> .env
// 				echo PUBLISHABLE_KEY=$ADPOLL_API_QA_PUBLISHABLE_KEY >> .env
// 				echo SECRET_KEY=$ADPOLL_API_QA_SECRET_KEY >> .env
// 				echo PASSWORD_ENCRYPTOR_DECRYPTOR_KEY=$ADPOLL_API_QA_PASSWORD_ENCRYPTOR_DECRYPTOR_KEY >> .env
// 				echo TWILIO_ACCOUNT_SID=$ADPOLL_API_QA_TWILIO_ACCOUNT_SID >> .env
// 				echo TWILIO_AUTH_TOKEN=$ADPOLL_API_QA_TWILIO_AUTH_TOKEN >> .env
// 				echo TWILIO_SERVICE_SID=$ADPOLL_API_QA_TWILIO_SERVICE_SID >> .env
// 				echo GOOGLE_CLIENT_ID=$ADPOLL_API_QA_GOOGLE_CLIENT_ID >> .env
// 				echo GOOGLE_CLIENT_SECRET=$ADPOLL_API_QA_GOOGLE_CLIENT_SECRET >> .env
// 				echo GOOGLE_AUTH_CALLBACK_URL=$ADPOLL_API_QA_GOOGLE_AUTH_CALLBACK_URL >> .env
// 				echo TWITTER_CLIENT_ID=$ADPOLL_API_QA_TWITTER_CLIENT_ID >> .env
// 				echo TWITTER_CLIENT_SECRET=$ADPOLL_API_QA_TWITTER_CLIENT_SECRET >> .env
// 				echo TWITTER_REDIRECT_URI=$ADPOLL_API_QA_TWITTER_REDIRECT_URI >> .env
// 				echo ADMIN_MAIL=$ADPOLL_API_QA_ADMIN_MAIL >> .env
// 				echo AWS_SECRET_ACCESS_KEY=$ADPOLL_API_QA_AWS_SECRET_ACCESS_KEY >> .env
// 				echo AWS_ACCESS_KEY=$ADPOLL_API_QA_AWS_ACCESS_KEY >> .env
// 				echo AWS_REGION=$ADPOLL_API_QA_AWS_REGION >> .env
// 				echo AWS_BUCKET_NAME=$ADPOLL_API_QA_AWS_BUCKET_NAME >> .env
//     			echo SESSION_SECRET=$ADPOLL_API_QA_SESSION_SECRET >> .env
// 				echo FACEBOOK_APP_ID=$ADPOLL_API_QA_FACEBOOK_APP_ID >> .env
//     			echo FACEBOOK_APP_SECRET=$ADPOLL_API_QA_FACEBOOK_APP_SECRET >> .env
// 				echo FACEBOOK_AUTH_CALLBACK_URL=$ADPOLL_API_QA_FACEBOOK_AUTH_CALLBACK_URL >> .env
//     				echo INVITE_EXPIRATION_MINUTES=$ADPOLL_API_QA_INVITE_EXPIRATION_MINUTES >> .env
// 				echo APPLE_PRIVATE_KEY=$ADPOLL_API_QA_APPLE_PRIVATE_KEY >> .env
// 				echo STRIPE_SECRET_KEY=$ADPOLL_API_QA_STRIPE_SECRET_KEY >> .env
//     				echo TWILIO_PHONE_NUMBER=$ADPOLL_API_QA_TWILIO_PHONE_NUMBER >> .env

//                 sed -i 's/environment/qa/g' ecosystem.config.js
                
//                 '''
//             }
//         }
//         stage('deploy-dev') {
//             when {
//                 branch 'main'
//             }
//             environment {
//                 ADPOLL_API_QA_IP = credentials("ADPOLL_API_QA_IP")
//             }
//             steps {
//                 withCredentials([
//                     sshUserPrivateKey(credentialsId: "jenkins-ssl-pool", keyFileVariable: 'sshkey')
//                 ]) {
//                     echo 'deploying the software'
//                     sh '''#!/bin/bash
//                     echo "Creating .ssh"
//                     mkdir -p /var/lib/jenkins/.ssh
//                     ssh-keyscan ${ADPOLL_API_QA_IP} >> /var/lib/jenkins/.ssh/known_hosts
//                     ssh -i $sshkey ubuntu@${ADPOLL_API_QA_IP} "mkdir -p /home/ubuntu/repo/QA-BACKEND-Audience-Pool/$BRANCH_NAME"
//                     rsync -avz --info=progress0,name0,flist0,stats2 --stats --exclude  '.git' --delete -e "ssh -i $sshkey" ./ ubuntu@${ADPOLL_API_QA_IP}:/home/ubuntu/repo/QA-BACKEND-Audience-Pool/$BRANCH_NAME
//                     npx sequelize-cli db:migrate
//                     ssh -i $sshkey ubuntu@${ADPOLL_API_QA_IP} "export PATH=\$PATH:/home/ubuntu/.nvm/versions/node/v22.12.0/bin && cd /home/ubuntu/repo/QA-BACKEND-Audience-Pool/$BRANCH_NAME && pm2 restart ecosystem.config.js && pm2 save"
//                     '''
//                 }
//             }
//         }
//     }
// }

// //         stage('create-env-prod') {
// //             when {
// //                 branch 'deploy-prod'
// //             }
// //             environment {
                
// //                   ADPOLL_API_QA_NODE_ENV = credentials("ADPOLL_API_QA_NODE_ENV")
// //                 ADPOLL_API_QA_PORT = credentials("ADPOLL_API_QA_PORT")
// //                 ADPOLL_API_QA_SOCKET_PORT = credentials("ADPOLL_API_QA_SOCKET_PORT")
// //                 ADPOLL_API_QA_JWT_SECRET = credentials("ADPOLL_API_QA_JWT_SECRET")
// //                 ADPOLL_API_QA_JWT_REFRESH_SECRET = credentials("ADPOLL_API_QA_JWT_REFRESH_SECRET")
// //                 ADPOLL_API_QA_DB_HOST = credentials("ADPOLL_API_QA_DB_HOST")
// //                 ADPOLL_API_QA_DB_USER = credentials("ADPOLL_API_QA_DB_USER")
// //                 ADPOLL_API_QA_DB_PASSWORD = credentials("ADPOLL_API_QA_DB_PASSWORD")
// //                 ADPOLL_API_QA_DB_NAME = credentials("ADPOLL_API_QA_DB_NAME")
// //                 ADPOLL_API_QA_DB_PORT = credentials("ADPOLL_API_QA_DB_PORT")
// //                 ADPOLL_API_QA_REMOTE_BASE_URL = credentials("ADPOLL_API_QA_REMOTE_BASE_URL")
// //                 ADPOLL_API_QA_REMOTE_BACKEND_URL = credentials("ADPOLL_API_QA_REMOTE_BACKEND_URL")
// //                 ADPOLL_API_QA_REDIS_HOST = credentials("ADPOLL_API_QA_REDIS_HOST")
// //                 ADPOLL_API_QA_REDIS_PORT = credentials("ADPOLL_API_QA_REDIS_PORT")
// //                 ADPOLL_API_QA_IP = credentials("ADPOLL_API_QA_IP")
// //                 BRANCH_NAME = '${env.BRANCH_NAME}'
// //             }
// //             steps {
// //                 echo 'Creating Enviorment varibles : '+env.BRANCH_NAME
// //                 sh '''#!/bin/bash
// //                 touch .env
// //                 echo NODE_ENV=$ADPOLL_API_QA_NODE_ENV >> .env
// //                 echo PORT=$ADPOLL_API_QA_PORT >> .env
// //                 echo SOCKET_PORT=$ADPOLL_API_QA_SOCKET_PORT >> .env
// //                 echo JWT_SECRET=$ADPOLL_API_QA_JWT_SECRET >> .env
// //                 echo JWT_REFRESH_SECRET=$ADPOLL_API_QA_JWT_REFRESH_SECRET >> .env
// //                 echo DB_HOST=$ADPOLL_API_QA_DB_HOST >> .env
// //                 echo DB_USER=$ADPOLL_API_QA_DB_USER >> .env
// //                 echo DB_PASSWORD=$ADPOLL_API_QA_DB_PASSWORD >> .env
// //                 echo DB_NAME=$ADPOLL_API_QA_DB_NAME >> .env
// //                 echo DB_PORT=$ADPOLL_API_QA_DB_PORT >> .env
// //                 echo REMOTE_BASE_URL=$ADPOLL_API_QA_REMOTE_BASE_URL >> .env
// //                 echo REMOTE_BACKEND_URL=$ADPOLL_API_QA_REMOTE_BACKEND_URL >> .env
// //                 echo REDIS_HOST=$ADPOLL_API_QA_REDIS_HOST >> .env
// //                 echo REDIS_PORT=$ADPOLL_API_QA_REDIS_PORT >> .env

// //                 sed -i 's/environment/prod/g' ecosystem.config.js

// //                 '''
// //             }
// //         }

// //         stage('deploy-prod') {
// //             when {
// //                 branch 'deploy-prod'
// //             }
// //             environment {
// //                 ADPOLL_API_PROD_IP = credentials("ADPOLL_API_PROD_IP")
// //             }
// //             steps {
// //                 withCredentials([
// //                     sshUserPrivateKey(credentialsId: "jenkins-ssl", keyFileVariable: 'sshkey')
// //                 ]) {
// //                     echo 'deploying the software'
// //                     sh '''#!/bin/bash
// //                     echo "Creating .ssh"
// //                     mkdir -p /var/lib/jenkins/.ssh
// //                     ssh-keyscan ${ADPOLL_API_PROD_IP} >> /var/lib/jenkins/.ssh/known_hosts
// //                     ssh -i $sshkey ubuntu@${ADPOLL_API_PROD_IP} "mkdir -p /home/ubuntu/repo/pocker-rpa-api/$BRANCH_NAME"
// //                     rsync -avz --exclude  '.git' --delete -e "ssh -i $sshkey" ./ ubuntu@${ADPOLL_API_PROD_IP}:/home/ubuntu/repo/pocker-rpa-api/$BRANCH_NAME
// //                     ssh -i $sshkey ubuntu@${ADPOLL_API_PROD_IP} "cd /home/ubuntu/repo/pocker-rpa-api/$BRANCH_NAME && pm2 stop ecosystem.config.js && pm2 start ecosystem.config.js && pm2 save"
// //                     '''
// //                 }
// //             }
// //         }
// //     }
// // }
