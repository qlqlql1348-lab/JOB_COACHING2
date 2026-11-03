import React, { useState } from 'react';
import { UserSpecData } from '../types/job';
import { GraduationCap, Award, Briefcase, Code, CheckCircle, Sparkles, Plus, Check } from 'lucide-react';
import confetti from 'canvas-confetti';

interface UserSpecFormProps {
  specData: UserSpecData;
  onChangeSpecData: (spec: UserSpecData) => void;
  onApplySpecToAnalysis: () => void;
}

export const UserSpecForm: React.FC<UserSpecFormProps> = ({
  specData,
  onChangeSpecData,
  onApplySpecToAnalysis,
}) => {
  const [customTechInput, setCustomTechInput] = useState('');

  const commonStacks = [
    'React',
    'TypeScript',
    'JavaScript',
    'Next.js',
    'Node.js',
    'Spring Boot',
    'Java',
    'Python',
    'SQL/MySQL',
    'Docker',
    'AWS',
    'Git/GitHub',
    'Figma',
    'Tailwind CSS',
  ];

  const handleToggleTech = (tech: string) => {
    const exists = specData.selectedTechStacks.includes(tech);
    const updated = exists
      ? specData.selectedTechStacks.filter((t) => t !== tech)
      : [...specData.selectedTechStacks, tech];
    onChangeSpecData({ ...specData, selectedTechStacks: updated });
  };

  const handleAddCustomTech = (e: React.FormEvent) => {
    e.preventDefault();
    if (customTechInput.trim() && !specData.selectedTechStacks.includes(customTechInput.trim())) {
      onChangeSpecData({
        ...specData,
        selectedTechStacks: [...specData.selectedTechStacks, customTechInput.trim()],
      });
      setCustomTechInput('');
    }
  };

  const handleQuickLanguage = (test: 'OPIc' | 'TOEIC Speaking' | 'TOEIC', score: string) => {
    onChangeSpecData({
      ...specData,
      languageTest: test,
      languageScore: score,
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onApplySpecToAnalysis();
    confetti({
      particleCount: 45,
      spread: 60,
      origin: { y: 0.6 },
    });
  };

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-indigo-50 text-indigo-700 font-black text-sm flex items-center justify-center border border-indigo-100">
            ★
          </div>
          <div>
            <h2 className="text-base font-bold text-slate-900 flex items-center gap-2">
              개인 스펙 입력 칸 (My Spec Sheet)
            </h2>
            <p className="text-xs text-slate-500 font-medium">
              학력, 학점, 어학, 인턴, 프로젝트 스펙을 입력하면 직무 기준선과 즉시 비교 분석합니다.
            </p>
          </div>
        </div>

        <button
          type="button"
          onClick={handleSubmit}
          className="bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold px-4 py-2 rounded-xl flex items-center gap-1.5 shadow-md shadow-indigo-600/20 transition-all self-start sm:self-auto"
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>내 스펙으로 갭 즉시 분석</span>
        </button>
      </div>

      {/* Form Fields Grid */}
      <form onSubmit={handleSubmit} className="space-y-5">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* 1. 학력 구분 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              최종 학력
            </label>
            <select
              value={specData.educationLevel}
              onChange={(e) =>
                onChangeSpecData({ ...specData, educationLevel: e.target.value as any })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="4년제 대졸">4년제 대졸 (졸업/예정)</option>
              <option value="2/3년제 전문대">2/3년제 전문대 졸업</option>
              <option value="대학원 석사 이상">대학원 석사 이상</option>
              <option value="고졸/기타">고졸 / 기타</option>
            </select>
          </div>

          {/* 2. 전공 계열 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <GraduationCap className="w-4 h-4 text-indigo-600" />
              전공 계열
            </label>
            <select
              value={specData.majorType}
              onChange={(e) =>
                onChangeSpecData({ ...specData, majorType: e.target.value as any })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value="전공자 (컴퓨터/소프트웨어)">전공자 (컴공 / 소프트웨어)</option>
              <option value="유관 전공 (전자/정보/수학/통계)">유관 전공 (전자/수학/통계/정보)</option>
              <option value="비전공자 (인문/상경/예체능)">비전공자 (인문 / 상경 / 기타)</option>
              <option value="부트캠프/국비 이수">부트캠프 / 국비지원 수료</option>
            </select>
          </div>

          {/* 3. 학점 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Award className="w-4 h-4 text-emerald-600" />
              학점 (GPA)
            </label>
            <div className="flex items-center gap-2">
              <input
                type="text"
                value={specData.gpa}
                onChange={(e) => onChangeSpecData({ ...specData, gpa: e.target.value })}
                placeholder="예: 3.8"
                className="w-1/2 bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 text-center"
              />
              <span className="text-xs text-slate-400 font-bold">/</span>
              <select
                value={specData.gpaMax}
                onChange={(e) => onChangeSpecData({ ...specData, gpaMax: e.target.value })}
                className="w-1/2 bg-white border border-slate-300 rounded-lg px-2 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="4.5">4.5 만점</option>
                <option value="4.3">4.3 만점</option>
                <option value="4.0">4.0 만점</option>
              </select>
            </div>
          </div>

          {/* 4. 어학 시험 & 점수 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center justify-between">
              <span className="flex items-center gap-1.5">
                <Award className="w-4 h-4 text-indigo-600" />
                공인 어학 성적
              </span>
            </label>
            <div className="grid grid-cols-2 gap-2">
              <select
                value={specData.languageTest}
                onChange={(e) =>
                  onChangeSpecData({ ...specData, languageTest: e.target.value as any })
                }
                className="bg-white border border-slate-300 rounded-lg px-2.5 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
              >
                <option value="OPIc">OPIc</option>
                <option value="TOEIC Speaking">토익스피킹</option>
                <option value="TOEIC">TOEIC</option>
                <option value="미보유">성적 미보유</option>
              </select>
              <input
                type="text"
                disabled={specData.languageTest === '미보유'}
                value={specData.languageTest === '미보유' ? '' : specData.languageScore}
                onChange={(e) => onChangeSpecData({ ...specData, languageScore: e.target.value })}
                placeholder="점수/등급 (예: IH, 850)"
                className="bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-bold text-slate-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:bg-slate-100 disabled:text-slate-400"
              />
            </div>
            {/* Quick Language Chips */}
            <div className="flex flex-wrap gap-1 pt-1">
              <button
                type="button"
                onClick={() => handleQuickLanguage('OPIc', 'IH')}
                className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 px-2 py-0.5 rounded font-medium"
              >
                OPIc IH
              </button>
              <button
                type="button"
                onClick={() => handleQuickLanguage('OPIc', 'AL')}
                className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 px-2 py-0.5 rounded font-medium"
              >
                OPIc AL
              </button>
              <button
                type="button"
                onClick={() => handleQuickLanguage('TOEIC', '850점')}
                className="text-[10px] bg-white border border-slate-200 hover:border-indigo-400 text-slate-700 px-2 py-0.5 rounded font-medium"
              >
                토익 850
              </button>
            </div>
          </div>

          {/* 5. 인턴 / 실무 경력 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Briefcase className="w-4 h-4 text-emerald-600" />
              인턴 / 실무 경력
            </label>
            <select
              value={specData.internshipMonths}
              onChange={(e) =>
                onChangeSpecData({ ...specData, internshipMonths: parseInt(e.target.value, 10) })
              }
              className="w-full bg-white border border-slate-300 rounded-lg px-3 py-2 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            >
              <option value={0}>경력 없음 (신입 준비)</option>
              <option value={3}>인턴 1~3개월</option>
              <option value={6}>인턴 6개월 이상</option>
              <option value={12}>주니어 실무 1년 이상</option>
            </select>
          </div>

          {/* 6. 프로젝트 및 수상 */}
          <div className="bg-slate-50/80 p-4 rounded-xl border border-slate-200 space-y-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-600" />
              수행 프로젝트 & 수상
            </label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-bold">프로젝트 수</span>
                <select
                  value={specData.projectCount}
                  onChange={(e) =>
                    onChangeSpecData({ ...specData, projectCount: parseInt(e.target.value, 10) })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>0개</option>
                  <option value={1}>1개</option>
                  <option value={2}>2개</option>
                  <option value={3}>3개 이상</option>
                </select>
              </div>
              <div>
                <span className="text-[10px] text-slate-500 block mb-0.5 font-bold">공모전/해커톤</span>
                <select
                  value={specData.awardsCount}
                  onChange={(e) =>
                    onChangeSpecData({ ...specData, awardsCount: parseInt(e.target.value, 10) })
                  }
                  className="w-full bg-white border border-slate-300 rounded-lg px-2 py-1.5 text-xs font-semibold text-slate-800 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                >
                  <option value={0}>없음</option>
                  <option value={1}>1건 수상</option>
                  <option value={2}>2건 이상 수상</option>
                </select>
              </div>
            </div>
          </div>
        </div>

        {/* 7. 핵심 보유 기술 스택 태그 (클릭으로 즉시 선택/해제) */}
        <div className="bg-slate-50/80 p-4.5 rounded-xl border border-slate-200 space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <label className="text-xs font-bold text-slate-800 flex items-center gap-1.5">
              <Code className="w-4 h-4 text-indigo-600" />
              내가 다룰 줄 아는 핵심 기술 스택 ({specData.selectedTechStacks.length}개 선택됨)
            </label>
            <span className="text-[11px] text-slate-500 font-medium">클릭하여 선택/해제</span>
          </div>

          {/* Quick Clickable Badges */}
          <div className="flex flex-wrap gap-1.5">
            {commonStacks.map((tech) => {
              const isSelected = specData.selectedTechStacks.includes(tech);
              return (
                <button
                  type="button"
                  key={tech}
                  onClick={() => handleToggleTech(tech)}
                  className={`px-3 py-1 rounded-lg text-xs font-bold transition-all flex items-center gap-1 shadow-2xs ${
                    isSelected
                      ? 'bg-indigo-600 text-white'
                      : 'bg-white text-slate-700 hover:bg-slate-100 border border-slate-300'
                  }`}
                >
                  {isSelected && <Check className="w-3 h-3 stroke-[3]" />}
                  <span>{tech}</span>
                </button>
              );
            })}
          </div>

          {/* Add custom tech stack */}
          <div className="flex gap-2 pt-1">
            <input
              type="text"
              placeholder="목록에 없는 기술 직접 추가 (예: Vue, NestJS, Kotlin, Flutter 등)"
              value={customTechInput}
              onChange={(e) => setCustomTechInput(e.target.value)}
              className="flex-1 bg-white border border-slate-300 rounded-lg px-3 py-1.5 text-xs text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
            <button
              type="button"
              onClick={handleAddCustomTech}
              className="bg-slate-100 hover:bg-slate-200 text-slate-800 border border-slate-300 rounded-lg px-3 py-1.5 text-xs font-bold flex items-center gap-1"
            >
              <Plus className="w-3.5 h-3.5" />
              추가
            </button>
          </div>
        </div>

        {/* Action Button */}
        <div className="flex justify-end pt-2">
          <button
            type="submit"
            className="w-full sm:w-auto bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-2.5 px-6 rounded-xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-md shadow-indigo-600/20 transition-all"
          >
            <CheckCircle className="w-4 h-4" />
            <span>위 스펙 저장 및 직무 요구 역량과 즉시 비교</span>
          </button>
        </div>
      </form>
    </div>
  );
};
