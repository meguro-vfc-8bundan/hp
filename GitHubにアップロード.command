#!/bin/bash

# ========================================
# 目黒消防団第８分団HP - GitHubアップロード
# ダブルクリックで実行できます
# ========================================

# スクリプトのあるディレクトリに移動
cd "$(dirname "$0")"

echo "========================================"
echo "  GitHubへのアップロードを開始します"
echo "========================================"
echo ""

# PATHにHomebrewを追加
export PATH="/opt/homebrew/bin:$PATH"

# Git認証ヘルパーをGitHub CLIに設定
gh auth setup-git 2>/dev/null

# 変更があるか確認
if git diff --quiet && git diff --staged --quiet && [ -z "$(git ls-files --others --exclude-standard)" ]; then
    echo "変更がありません。アップロードするものがありません。"
    echo ""
    echo "何かキーを押すと閉じます..."
    read -n 1
    exit 0
fi

# 変更内容を表示
echo "【変更されたファイル】"
git status --short
echo ""

# すべてのファイルをステージング
git add .

# 日時付きでコミット
COMMIT_DATE=$(date "+%Y-%m-%d %H:%M")
git commit -m "更新: $COMMIT_DATE"

echo ""

# プッシュ
echo "GitHubにプッシュ中..."
git push -u origin main 2>&1 || git push -u origin master 2>&1

echo ""
echo "========================================"
echo "  アップロード完了！"
echo "========================================"
echo ""
echo "GitHub: https://github.com/meguro-vfc-8bundan/hp"
echo ""
echo "何かキーを押すと閉じます..."
read -n 1
