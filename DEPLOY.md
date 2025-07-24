# GitHub → AWS Amplify デプロイ手順

## 1. GitHubリポジトリの作成

1. GitHubで新しいリポジトリを作成
2. ローカルリポジトリをGitHubにプッシュ

```bash
# GitHubリポジトリのURLを設定
git remote add origin https://github.com/your-username/nippo-app.git

# ブランチ名をmainに設定
git branch -M main

# GitHubにプッシュ
git push -u origin main
```

## 2. AWS Amplifyでアプリケーションを作成

### AWS Management Consoleから

1. AWS Management Consoleにログイン
2. AWS Amplifyサービスを開く
3. 「新しいアプリ」→「ウェブアプリケーションをホスティング」を選択
4. 「GitHub」を選択してGitHubアカウントを認証
5. リポジトリとブランチ（main）を選択
6. ビルド設定は自動検出される（`amplify.yml`が使用される）
7. 「保存してデプロイ」をクリック

### Amplify CLIから（オプション）

```bash
# Amplify CLIのインストール
npm install -g @aws-amplify/cli

# Amplifyプロジェクトの初期化
amplify init

# ホスティングの追加
amplify add hosting

# デプロイ
amplify publish
```

## 3. 自動デプロイの確認

- GitHubの`main`ブランチにプッシュすると自動でデプロイが開始される
- AWS Amplifyコンソールでデプロイ状況を確認可能
- ビルド時間は通常2-5分程度

## 4. 環境変数の設定（必要に応じて）

AWS Amplifyコンソールで環境変数を設定:

1. アプリケーション詳細ページを開く
2. 「環境変数」タブを選択
3. 必要な環境変数を追加

```
NODE_ENV=production
VITE_APP_TITLE=定形業務日報アプリ
```

## 5. カスタムドメインの設定（オプション）

1. AWS Amplifyコンソールで「ドメイン管理」を選択
2. カスタムドメインを追加
3. DNS設定を更新（CNAMEレコードを追加）

## トラブルシューティング

### ビルドエラーが発生した場合

1. `amplify.yml`の設定を確認
2. `package.json`の依存関係を確認
3. AWS Amplifyコンソールのビルドログを確認

### デプロイが開始されない場合

1. GitHubとAWS Amplifyの連携を確認
2. Webhookの設定を確認
3. ブランチの設定を確認

## 参考リンク

- [AWS Amplify Hosting](https://docs.aws.amazon.com/amplify/latest/userguide/welcome.html)
- [GitHub Integration](https://docs.aws.amazon.com/amplify/latest/userguide/getting-started.html)