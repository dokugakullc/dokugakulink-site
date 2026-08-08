#!/usr/bin/env bash
# notify-deploy.yml のイベント条件 fixture テスト（Secret/外部通信を使わない静的テスト）。
# workflow の job-level if: と同一の3条件（deployment.environment / deployment_status.creator.login /
# deployment_status.state）を jq で再現し、通知ルーティングを検証する。
# route(): deploy(=notify-success) / alerts(=notify-failure) / skip(=どちらも実行しない)
set -euo pipefail

route() {
  local j="$1" env creator state
  env=$(printf '%s' "$j" | jq -r '.deployment.environment // ""')
  creator=$(printf '%s' "$j" | jq -r '.deployment_status.creator.login // ""')
  state=$(printf '%s' "$j" | jq -r '.deployment_status.state // ""')
  # workflow if: と一致:
  #  notify-success = Production & vercel[bot] & success
  #  notify-failure = Production & vercel[bot] & (failure|error)
  if [ "$env" = "Production" ] && [ "$creator" = "vercel[bot]" ]; then
    case "$state" in
      success) echo deploy ;;
      failure|error) echo alerts ;;
      *) echo skip ;;
    esac
  else
    echo skip
  fi
}

mk() { # environment creator state -> deployment_status event JSON（実 payload の該当フィールドのみ）
  jq -n --arg e "$1" --arg c "$2" --arg s "$3" \
    '{deployment:{environment:$e, sha:"abc1234def0"}, deployment_status:{state:$s, creator:{login:$c}, description:"Deployment", target_url:"https://example"}}'
}

fail=0
check() { # desc expected environment creator state
  local got; got=$(route "$(mk "$3" "$4" "$5")")
  if [ "$got" = "$2" ]; then printf 'PASS  %-42s -> %s\n' "$1" "$got"
  else printf 'FAIL  %-42s -> got=%s expected=%s\n' "$1" "$got" "$2"; fail=1; fi
}

check "Production+vercel[bot]+success"       deploy Production "vercel[bot]" success
check "Production+vercel[bot]+failure"       alerts Production "vercel[bot]" failure
check "Production+vercel[bot]+error"         alerts Production "vercel[bot]" error
check "Preview+vercel[bot]+success(除外)"    skip   Preview    "vercel[bot]" success
check "Production+別creator(除外)"           skip   Production "other-bot"   success
check "Production+vercel[bot]+pending(除外)" skip   Production "vercel[bot]" pending
check "Production+vercel[bot]+in_progress(除外)" skip Production "vercel[bot]" in_progress
check "Production+vercel[bot]+queued(除外)"  skip   Production "vercel[bot]" queued
check "Production+vercel[bot]+inactive(除外)" skip  Production "vercel[bot]" inactive

if [ "$fail" -eq 0 ]; then echo "ALL FIXTURE CASES PASSED"; else echo "FIXTURE FAILURES PRESENT"; fi
exit $fail
