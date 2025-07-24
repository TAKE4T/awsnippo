# 定形業務日報アプリ (Nippo App)

日々の定形業務を管理し、日報を自動生成するReactアプリケーションです。

## 機能

- 定形業務タスクの選択・作成
- 自由入力によるタスク作成
- ドラッグ&ドロップによるスケジュール配置
- 日報の自動生成とクリップボードコピー
- レスポンシブデザイン

## 技術スタック

- React 18
- TypeScript
- Vite
- Tailwind CSS
- Radix UI
- Lucide React

## 開発環境のセットアップ

```bash
# 依存関係のインストール
npm install

# 開発サーバーの起動
npm run dev

# ビルド
npm run build

# プレビュー
npm run preview
```

## AWS デプロイメント

このアプリケーションは複数の方法でAWSにデプロイできます：

### 1. AWS Amplify (推奨)

```bash
# Amplify CLIのインストール
npm install -g @aws-amplify/cli

# デプロイ
./scripts/deploy-amplify.sh
```

### 2. S3 + CloudFront

```bash
# S3バケットとCloudFrontを使用したデプロイ
./deploy.sh
```

### 3. CloudFormation

```bash
# CloudFormationテンプレートを使用
aws cloudformation create-stack \
  --stack-name nippo-app-stack \
  --template-body file://cloudformation.yml \
  --parameters ParameterKey=BucketName,ParameterValue=your-bucket-name
```

### 4. Docker + ECS

```bash
# DockerイメージをビルドしてECSにデプロイ
./scripts/deploy-docker.sh
```

### 5. Serverless Framework

```bash
# Serverless Frameworkを使用
npm install -g serverless serverless-finch
serverless deploy
```

## 環境設定

`.env.example`を`.env`にコピーして、必要な環境変数を設定してください：

```bash
cp .env.example .env
```

## ファイル構成

```
├── components/           # Reactコンポーネント
│   ├── ui/              # UI基盤コンポーネント
│   ├── FreeTaskInput.tsx
│   ├── TaskCard.tsx
│   ├── TaskSelector.tsx
│   └── TimeScheduler.tsx
├── styles/              # スタイルファイル
├── scripts/             # デプロイスクリプト
├── amplify.yml          # AWS Amplify設定
├── buildspec.yml        # AWS CodeBuild設定
├── cloudformation.yml   # CloudFormation テンプレート
├── Dockerfile           # Docker設定
├── serverless.yml       # Serverless Framework設定
└── deploy.sh            # S3デプロイスクリプト
```

## ライセンス

MIT License