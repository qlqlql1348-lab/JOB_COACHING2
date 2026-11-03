import { JobRole, UserCompetencyInput, GapAnalysisOutput, CriticalGap, SpecEvaluationItem } from '../types/job';

/**
 * Calculates deterministic competency gap metrics instantly on the client side.
 * Keeps output punchy, concise and free from walls of text.
 */
export function calculateLocalGapAnalysis(
  job: JobRole,
  input: UserCompetencyInput
): GapAnalysisOutput {
  const benchmarkSkills = job.benchmarkSkills;
  let totalBenchmarkScore = 0;
  let totalUserScore = 0;
  const criticalGaps: CriticalGap[] = [];
  const strengthPoints: string[] = [];

  // Calculate skill scores
  benchmarkSkills.forEach((skill) => {
    const required = skill.benchmarkLevel;
    const current = input.skills[skill.id] ?? 1.0;

    // Weight by importance
    const weight = skill.importance === '필수' ? 1.5 : skill.importance === '우대' ? 1.1 : 0.8;

    totalBenchmarkScore += required * weight;
    totalUserScore += Math.min(current, required * 1.1) * weight;

    const diff = required - current;

    if (diff > 0.8) {
      let gapDegree: '보완 시급' | '중점 보강' | '기초 필요' = '중점 보강';
      if (diff >= 1.8 || skill.importance === '필수') {
        gapDegree = '보완 시급';
      } else if (current <= 1.5) {
        gapDegree = '기초 필요';
      }

      criticalGaps.push({
        skill: skill.name,
        currentLevel: current,
        requiredLevel: required,
        gapDegree,
        urgentReason: `요구(${required.toFixed(1)}점) 대비 -${diff.toFixed(1)}점 부족`,
        actionItem: `${skill.learningKeyword || skill.name} 핵심 실습 프로젝트 제작`,
        importance: skill.importance,
      });
    } else if (current >= required) {
      strengthPoints.push(
        `${skill.name} 요구 수준 충족 (${current.toFixed(1)}점)`
      );
    }
  });

  // Calculate certificate gap
  const userCerts = input.certificates || [];
  const missingCertInfos = job.benchmarkCertificates.filter(
    (c) => !userCerts.some((uc) => uc.toLowerCase().includes(c.name.toLowerCase()) || c.name.toLowerCase().includes(uc.toLowerCase()))
  );

  // Raw score ratio
  let rawScore = Math.round((totalUserScore / (totalBenchmarkScore || 1)) * 100);

  // Certificate bonus / penalty
  const certRatio = job.benchmarkCertificates.length > 0 
    ? (job.benchmarkCertificates.length - missingCertInfos.length) / job.benchmarkCertificates.length 
    : 1;
  
  // Spec score bonus
  let specBonus = 0;
  const specEvaluations: SpecEvaluationItem[] = [];

  if (input.userSpec) {
    const spec = input.userSpec;

    // 1. 학력 & 전공
    const isMajor = spec.majorType.includes('전공자');
    const is4Year = spec.educationLevel.includes('4년제') || spec.educationLevel.includes('대학원');
    if (isMajor && is4Year) {
      specBonus += 5;
      specEvaluations.push({
        name: '학력 & 전공',
        currentVal: `${spec.educationLevel} (${spec.majorType.split(' ')[0]})`,
        targetVal: '4년제 / 관련 전공',
        status: '충족',
        oneLineAction: '전공 기초 CS를 면접에서 적극 어필하세요.',
      });
    } else {
      specEvaluations.push({
        name: '학력 & 전공',
        currentVal: `${spec.educationLevel} (${spec.majorType.split(' ')[0]})`,
        targetVal: '전공 지식 증명',
        status: isMajor ? '충족' : '보강권장',
        oneLineAction: isMajor ? '학력 무관 실무 포트폴리오 강화' : '전공 CS 지식 및 실무 프로젝트로 보완',
      });
    }

    // 2. 학점
    const gpaNum = parseFloat(spec.gpa || '3.5');
    if (gpaNum >= 3.5) {
      specBonus += 3;
      specEvaluations.push({
        name: '학점',
        currentVal: `${spec.gpa} / ${spec.gpaMax}`,
        targetVal: '3.5 이상 (안정권)',
        status: '충족',
        oneLineAction: '성실성을 증명하는 안정적 학점입니다.',
      });
    } else {
      specEvaluations.push({
        name: '학점',
        currentVal: `${spec.gpa || '3.0'} / ${spec.gpaMax}`,
        targetVal: '3.5 이상 권장',
        status: '보강권장',
        oneLineAction: '학점 질문 대비 프로젝트 성과 중심 방어',
      });
    }

    // 3. 어학 성적
    const hasLang = spec.languageTest !== '미보유' && spec.languageScore.trim().length > 0;
    if (hasLang) {
      specBonus += 4;
      specEvaluations.push({
        name: '공인 어학',
        currentVal: `${spec.languageTest} ${spec.languageScore}`,
        targetVal: 'OPIc IM2+ / TOEIC 750+',
        status: '충족',
        oneLineAction: '대기업 및 외국계 서류 요건을 충족합니다.',
      });
    } else {
      specEvaluations.push({
        name: '공인 어학',
        currentVal: '점수 미보유',
        targetVal: 'OPIc IM2+ 권장',
        status: '시급보완',
        oneLineAction: '단기(3~4주) OPIc 또는 토스 성적 취득 추천',
      });
    }

    // 4. 인턴 & 실무 경험
    const hasExp = spec.internshipMonths > 0 || spec.projectCount >= 2;
    if (hasExp) {
      specBonus += 5;
      specEvaluations.push({
        name: '실무/프로젝트',
        currentVal: `인턴 ${spec.internshipMonths}개월 / 플젝 ${spec.projectCount}개`,
        targetVal: '프로젝트 2개 이상',
        status: '충족',
        oneLineAction: '프로젝트 트러블슈팅과 지표를 강조하세요.',
      });
    } else {
      specEvaluations.push({
        name: '실무/프로젝트',
        currentVal: `인턴 0개월 / 플젝 ${spec.projectCount}개`,
        targetVal: '배포 프로젝트 2개 필수',
        status: '시급보완',
        oneLineAction: '실사용자 피드백이 담긴 협업 프로젝트 1건 추가',
      });
    }
  }

  // Adjusted overall fit score
  const overallFitScore = Math.min(
    98,
    Math.max(15, Math.round(rawScore * 0.75 + certRatio * 15 + specBonus))
  );

  // Concise headlines (anti-slop, no walls of text)
  let evaluationHeadline = '';
  let evaluationSummary = '';

  if (overallFitScore >= 80) {
    evaluationHeadline = '🎯 합격 안정권 (80점 이상) — 실전 면접 디테일에 집중할 타이밍';
    evaluationSummary = '직무 필수 기술 및 스펙 요건을 대부분 충족했습니다. 포트폴리오 트러블슈팅 사례와 모의 면접으로 합격 확률을 굳히세요.';
  } else if (overallFitScore >= 60) {
    evaluationHeadline = '📈 기본기 양호 — 핵심 기술 갭 2개 및 부족 스펙 보강 시 합격권';
    evaluationSummary = '기초 역량은 갖추었으나 채용 기준선 대비 실무 프로젝트 깊이와 자격증 갭이 있습니다. 4~6주 집중 보완을 권장합니다.';
  } else {
    evaluationHeadline = '🚀 단계별 맞춤 보완 필요 — 12주 로드맵 1단계부터 실행';
    evaluationSummary = '목표 직무 기준선 대비 필수 기술과 프로젝트 경험의 체계적 보강이 필요합니다. 제공된 로드맵을 순서대로 진행해 보세요.';
  }

  // Recommended certifications from missing
  const recommendedCertifications = missingCertInfos.map((c) => ({
    name: c.name,
    priority: c.priority,
    estimatedWeeks: c.estimatedWeeks,
    difficulty: c.difficulty,
    reason: c.reason,
    studyTips: c.studyTips,
  }));

  // Recommended tech stack
  const recommendedTechStack = criticalGaps.slice(0, 4).map((g) => ({
    name: g.skill,
    category: '핵심 실무 기술',
    reason: g.urgentReason,
    recommendedResources: ['공식 기술 문서', '실무 레퍼런스', '튜토리얼'],
  }));

  return {
    overallFitScore,
    evaluationHeadline,
    evaluationSummary,
    strengthPoints: strengthPoints.length > 0 ? strengthPoints : ['성실한 학습 태도와 명확한 직무 목표'],
    criticalGaps: criticalGaps.sort((a, b) => (b.requiredLevel - b.currentLevel) - (a.requiredLevel - a.currentLevel)),
    specEvaluations: specEvaluations.length > 0 ? specEvaluations : undefined,
    recommendedCertifications,
    recommendedTechStack,
    customRoadmap: job.defaultRoadmap,
    interviewDefenseTips: [
      '부족한 기술은 변명 대신 현재 학습 중인 구체적 경로와 완료 목표일로 답변하세요.',
      '이론 부족은 "직접 토이 프로젝트에서 겪은 디버깅 경험"으로 극복했음을 강조하세요.',
      '자격증 미보유 질문에는 "실제 코드와 GitHub 커밋 기록으로 역량을 증명하고 있다"고 대응하세요.',
    ],
    isAiGenerated: false,
  };
}
